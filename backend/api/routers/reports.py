from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from backend.database.session import get_db
from backend.models.report import Complaint, Transaction, FraudReport
from backend.models.entities import Location, ScamPattern, PhoneNumber, Device
from backend.schemas.analyze import ReportCreateRequest
from backend.services.graph import graph_service
from backend.api.dependencies import get_current_user
from backend.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/report", tags=["Scam Reporting & Management"])

class TransactionSchema(BaseModel):
    amount: float
    sender_bank: Optional[str] = None
    receiver_bank: Optional[str] = None
    receiver_upi: Optional[str] = None
    transaction_reference: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    risk_score: float
    reporter_phone: Optional[str]
    reporter_email: Optional[str]
    suspect_phone: Optional[str]
    suspect_upi: Optional[str]
    suspect_device_id: Optional[str]
    suspect_ip: Optional[str]
    suspect_email: Optional[str]
    created_at: str

    class Config:
        from_attributes = True

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    payload: ReportCreateRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Submits a new citizen fraud complaint, logs it, and updates the Neo4j graph network."""
    # Find or create location mapping
    location_id = None
    if payload.district:
        loc_res = await db.execute(select(Location).filter_by(name=payload.district))
        loc = loc_res.scalars().first()
        if not loc:
            loc = Location(name=payload.district, state="Unknown")
            db.add(loc)
            await db.flush()
        location_id = loc.id

    # Find or create scam pattern
    pattern_id = None
    if payload.scam_category:
        pat_res = await db.execute(select(ScamPattern).filter_by(name=payload.scam_category))
        pat = pat_res.scalars().first()
        if not pat:
            pat = ScamPattern(name=payload.scam_category, description="Automatically registered pattern category")
            db.add(pat)
            await db.flush()
        pattern_id = pat.id

    # Create primary Complaint
    new_complaint = Complaint(
        user_id=current_user.id if current_user else None,
        title=payload.title,
        description=payload.description,
        scam_pattern_id=pattern_id,
        location_id=location_id,
        status="pending",
        reporter_phone=payload.reporter_phone,
        reporter_email=payload.reporter_email,
        suspect_phone=payload.suspect_phone,
        suspect_upi=payload.suspect_upi,
        suspect_bank_account=payload.suspect_bank_account,
        suspect_device_id=payload.suspect_device_id,
        suspect_ip=payload.suspect_ip,
        suspect_email=payload.suspect_email,
        risk_score=75.0 if (payload.suspect_phone or payload.suspect_upi) else 35.0
    )
    db.add(new_complaint)
    await db.flush()

    # Create Transaction record if details provided
    if payload.amount_lost and payload.amount_lost > 0:
        new_txn = Transaction(
            complaint_id=new_complaint.id,
            amount=payload.amount_lost,
            sender_bank=payload.sender_bank,
            receiver_bank=payload.receiver_bank,
            receiver_upi=payload.suspect_upi,
            transaction_reference="TXN_NEW_REPORT"
        )
        db.add(new_txn)

    # Register suspect phone in PostgreSQL directory
    if payload.suspect_phone:
        p_res = await db.execute(select(PhoneNumber).filter_by(phone_number=payload.suspect_phone))
        phone_node = p_res.scalars().first()
        if not phone_node:
            phone_node = PhoneNumber(phone_number=payload.suspect_phone, is_scam=True, reported_count=1, risk_level="high")
            db.add(phone_node)
        else:
            phone_node.reported_count += 1
            phone_node.risk_level = "critical" if phone_node.reported_count > 3 else "high"

    # Register suspect device in PostgreSQL directory
    if payload.suspect_device_id:
        d_res = await db.execute(select(Device).filter_by(device_identifier=payload.suspect_device_id))
        device_node = d_res.scalars().first()
        if not device_node:
            device_node = Device(device_identifier=payload.suspect_device_id, is_scam=True, reported_count=1)
            db.add(device_node)
        else:
            device_node.reported_count += 1

    await db.commit()
    await db.refresh(new_complaint)

    # Propagate connection node metadata to Neo4j graph network
    graph_service.add_complaint_node_network(
        victim_name=current_user.full_name if current_user else "Anonymous Citizen",
        victim_phone=payload.reporter_phone or "+910000000000",
        suspect_phone=payload.suspect_phone,
        suspect_upi=payload.suspect_upi,
        suspect_device=payload.suspect_device_id,
        suspect_ip=payload.suspect_ip
    )

    return ReportResponse.model_validate(new_complaint, from_attributes=True)

@router.get("", response_model=List[ReportResponse])
async def list_reports(
    db: AsyncSession = Depends(get_db),
    status_filter: Optional[str] = None
):
    """Lists all complaints submitted on the platform (recent first)."""
    query = select(Complaint)
    if status_filter:
        query = query.filter_by(status=status_filter)
    query = query.order_by(desc(Complaint.created_at))
    
    result = await db.execute(query)
    complaints = result.scalars().all()
    
    return [
        ReportResponse.model_validate(c, from_attributes=True)
        for c in complaints
    ]
