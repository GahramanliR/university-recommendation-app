from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from schemas.UserCreate import UserCreate
from schemas.UserResponse import UserResponse
from schemas.UserLogin import UserLogin
from utils.security import verify_password
from utils.jwt import create_access_token
from fastapi.security import OAuth2PasswordRequestForm

from crud.user import (
    create_user,
    get_user_by_username
)

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = get_user_by_username(
        db,
        user.username
    )
    if (existing_user):
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )
    return create_user(db, user)

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = get_user_by_username(
        db,
        form_data.username
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    valid_password = verify_password(
        form_data.password,
        user.hashed_password
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token({
        "sub": user.username
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }