from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from backend.models.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="citizen", nullable=False) # citizen, police, admin
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=True) # relevant for police users mapping to districts
