from typing import List, Optional
from sqlalchemy import String, Float, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.models.base import Base

class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False) # e.g. "Mumbai Cyber Cell", "Delhi North"
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    district_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    complaints: Mapped[List["Complaint"]] = relationship(back_populates="location")

class ScamPattern(Base):
    __tablename__ = "scam_patterns"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False) # e.g. "Digital Arrest Scam"
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    severity_level: Mapped[str] = mapped_column(String(50), default="medium", nullable=False) # high, medium, low
    
    complaints: Mapped[List["Complaint"]] = relationship(back_populates="scam_pattern")

class PhoneNumber(Base):
    __tablename__ = "phone_numbers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    phone_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(50), default="low", nullable=False) # critical, high, medium, low
    is_scam: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    reported_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

class Device(Base):
    __tablename__ = "devices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    device_identifier: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False) # IMEI or MAC or UUID
    device_model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_scam: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    reported_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
