from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from backend.database.session import get_db
from backend.models.report import Complaint, Transaction
from backend.models.entities import Location, ScamPattern, PhoneNumber, Device
from backend.services.graph import graph_service
from pydantic import BaseModel

router = APIRouter(tags=["Analytics & Dashboards"])

class DashboardStats(BaseModel):
    total_cases: int
    pending_cases: int
    investigating_cases: int
    resolved_cases: int
    total_amount_lost: float
    scam_type_counts: Dict[str, int]
    district_counts: Dict[str, int]

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Retrieves high-level summary counts for cases, lost amounts, categories, and locations."""
    # Count complaints by status
    total_res = await db.execute(select(func.count(Complaint.id)))
    total_cases = total_res.scalar() or 0
    
    pending_res = await db.execute(select(func.count(Complaint.id)).filter_by(status="pending"))
    pending_cases = pending_res.scalar() or 0

    inv_res = await db.execute(select(func.count(Complaint.id)).filter_by(status="investigating"))
    investigating_cases = inv_res.scalar() or 0

    res_res = await db.execute(select(func.count(Complaint.id)).filter_by(status="resolved"))
    resolved_cases = res_res.scalar() or 0

    # Total amount lost from transactions
    amount_res = await db.execute(select(func.sum(Transaction.amount)))
    total_amount_lost = float(amount_res.scalar() or 0.0)

    # Counts by Scam Pattern
    scam_type_counts = {}
    scam_res = await db.execute(
        select(ScamPattern.name, func.count(Complaint.id))
        .join(Complaint, Complaint.scam_pattern_id == ScamPattern.id)
        .group_by(ScamPattern.name)
    )
    for name, count in scam_res.all():
        scam_type_counts[name] = count

    # Counts by District
    district_counts = {}
    dist_res = await db.execute(
        select(Location.name, func.count(Complaint.id))
        .join(Complaint, Complaint.location_id == Location.id)
        .group_by(Location.name)
    )
    for name, count in dist_res.all():
        district_counts[name] = count

    return DashboardStats(
        total_cases=total_cases,
        pending_cases=pending_cases,
        investigating_cases=investigating_cases,
        resolved_cases=resolved_cases,
        total_amount_lost=total_amount_lost,
        scam_type_counts=scam_type_counts,
        district_counts=district_counts
    )

@router.get("/analytics")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """Returns spatial, temporal, and risk-indexed data, including coordinate hot spots for map heatmaps."""
    # Active locations with coordinates for geo heatmap
    hot_spots = []
    loc_query = await db.execute(
        select(Location.name, Location.latitude, Location.longitude, func.count(Complaint.id))
        .join(Complaint, Complaint.location_id == Location.id)
        .group_by(Location.name, Location.latitude, Location.longitude)
    )
    for name, lat, lng, count in loc_query.all():
        hot_spots.append({
            "name": name,
            "lat": lat or 20.0, # fallback
            "lng": lng or 78.0,
            "value": count
        })

    # Flagged account entities index
    flagged_phones = []
    phone_query = await db.execute(select(PhoneNumber).order_by(PhoneNumber.reported_count.desc()).limit(5))
    for p in phone_query.scalars().all():
        flagged_phones.append({
            "identifier": p.phone_number,
            "risk_level": p.risk_level,
            "reports": p.reported_count
        })

    flagged_devices = []
    dev_query = await db.execute(select(Device).order_by(Device.reported_count.desc()).limit(5))
    for d in dev_query.scalars().all():
        flagged_devices.append({
            "identifier": d.device_identifier,
            "model": d.device_model or "Unknown Device",
            "reports": d.reported_count
        })

    return {
        "heatmap": hot_spots,
        "flagged_phones": flagged_phones,
        "flagged_devices": flagged_devices,
        "trends": [],
    }

@router.get("/fraud-network")
async def get_fraud_network():
    """Queries Neo4j cluster networks returning both node link schemas and fraud syndicate clusters."""
    graph = graph_service.get_network_graph()
    clusters = graph_service.detect_clusters()
    return {
        "graph": graph,
        "clusters": clusters
    }
