from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.database.session import get_db
from backend.models.user import User
from backend.core.security import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = Field("citizen", description="Role can be citizen, police, or admin")
    district: str = Field(None, description="Assigned district/cyber cell for officers")

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    email: str
    full_name: str

@router.post("/signup", response_model=Token)
async def signup(user_data: UserSignup, db: AsyncSession = Depends(get_db)):
    """Registers a new user and returns their initial JWT access token."""
    # Check if email exists
    result = await db.execute(select(User).filter_by(email=user_data.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
        
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name,
        role=user_data.role,
        district=user_data.district,
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate token
    token = create_access_token(subject=new_user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        role=new_user.role,
        email=new_user.email,
        full_name=new_user.full_name
    )

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    """Authenticates a user via OAuth2 credentials (form urlencoded) and returns a JWT."""
    result = await db.execute(select(User).filter_by(email=form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated."
        )
        
    token = create_access_token(subject=user.id)
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        email=user.email,
        full_name=user.full_name
    )
