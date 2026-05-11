from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.review import Review
from schemas.ReviewCreate import ReviewCreate
from schemas.ReviewResponse import ReviewResponse
from crud.review import create_review, get_reviews_by_university
from models.user import User
from utils.dependencies import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/", response_model=ReviewResponse)
def create(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_review(
        db=db,
        review_data=review,
        user_id=current_user.id
    )

@router.get("/university/{university_id}", response_model=list[ReviewResponse])
def get_reviews(
    university_id: int,
    db: Session = Depends(get_db)
):
    return get_reviews_by_university(db, university_id)