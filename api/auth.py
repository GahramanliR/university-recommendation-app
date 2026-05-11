from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from schemas.UserCreate import UserCreate
from schemas.UserResponse import UserResponse

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

