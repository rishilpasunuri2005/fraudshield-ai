from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, Float, ForeignKey, Text, JSON, Numeric, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.models.base import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    scam_pattern_id: Mapped[Optional[int]] = mapped_column(ForeignKey("scam_patterns.id"), nullable=True)
    location_id: Mapped[Optional[int]] = mapped_column(ForeignKey("locations.id"), nullable=True)
    
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False) # pending, investigating, resolved, dismissed
    
    reporter_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    reporter_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    suspect_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    suspect_upi: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    suspect_bank_account: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    suspect_device_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    suspect_ip: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    suspect_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    risk_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    # Relationships
    user: Mapped[Optional["User"]] = relationship(foreign_keys=[user_id])
    scam_pattern: Mapped[Optional["ScamPattern"]] = relationship(back_populates="complaints")
    location: Mapped[Optional["Location"]] = relationship(back_populates="complaints")
    evidence: Mapped[List["Evidence"]] = relationship(back_populates="complaint", cascade="all, delete-orphan")
    transactions: Mapped[List["Transaction"]] = relationship(back_populates="complaint", cascade="all, delete-orphan")
    fraud_reports: Mapped[List["FraudReport"]] = relationship(back_populates="complaint", cascade="all, delete-orphan")

class FraudReport(Base):
    __tablename__ = "fraud_reports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    complaint_id: Mapped[Optional[int]] = mapped_column(ForeignKey("complaints.id"), nullable=True)
    
    category: Mapped[str] = mapped_column(String(100), nullable=False) # Digital Arrest, UPI Fraud, OTP Scam etc.
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    recommendation: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # stores structured evidence findings
    
    complaint: Mapped[Optional["Complaint"]] = relationship(back_populates="fraud_reports")

class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    complaint_id: Mapped[int] = mapped_column(ForeignKey("complaints.id"), nullable=False)
    
    file_type: Mapped[str] = mapped_column(String(50), nullable=False) # image, audio, text
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    analysis_results: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    complaint: Mapped["Complaint"] = relationship(back_populates="evidence")

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    complaint_id: Mapped[int] = mapped_column(ForeignKey("complaints.id"), nullable=False)
    
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    sender_bank: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    receiver_bank: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    receiver_upi: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    transaction_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    transaction_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    complaint: Mapped["Complaint"] = relationship(back_populates="transactions")
