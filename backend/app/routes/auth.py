from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.dependencies import get_current_user
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.utils.auth import hash_password, verify_password, create_access_token
from app.models.user import User
from app.database import get_db

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = User(
        full_name=request.full_name,
        company_name=request.company_name,
        email=request.email,
        password_hash=hash_password(request.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user.id,
            full_name=user.full_name,
            company_name=user.company_name,
            email=user.email
        )
    )

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user.id,
            full_name=user.full_name,
            company_name=user.company_name,
            email=user.email
        )
    )

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return UserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        company_name=current_user.company_name,
        email=current_user.email
    )