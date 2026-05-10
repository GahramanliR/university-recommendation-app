from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.review import Review
from schemas.ReviewCreate import ReviewCreate
from schemas.ReviewResponse import ReviewResponse
from crud.review import create_review, get_reviews_by_university

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/", response_model=ReviewResponse)
def create(
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    return create_review(db, review)

@router.get("/university/{university_id}", response_model=list[ReviewResponse])
def get_reviews(
    university_id: int,
    db: Session = Depends(get_db)
):
    return get_reviews_by_university(db, university_id)