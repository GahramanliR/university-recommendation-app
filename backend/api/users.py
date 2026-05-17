from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from crud.user import get_user_by_id
from database import get_db
from models.user import User
from schemas.UserProfile import UserProfile
from schemas.UserResponse import UserResponse
from utils.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserProfile)
def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = get_user_by_id(db, current_user.id)

    return {
        "id": user.id,
        "username": user.username,
        "total_reviews": len(user.reviews),
        "reviews": user.reviews
    }