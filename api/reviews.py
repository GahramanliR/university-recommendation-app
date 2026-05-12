from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from crud.university import get_university_by_id
from database import get_db
from models.review import Review
from schemas.ReviewCreate import ReviewCreate
from schemas.ReviewResponse import ReviewResponse
from crud.review import create_review, delete_review, get_review_by_id, get_reviews_by_university, update_review
from models.user import User
from schemas.ReviewUpdate import ReviewUpdate
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
    university = get_university_by_id(university_id, db)
    if not university:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )
    return get_reviews_by_university(db, university_id)

@router.put("/{review_id}")
def update_review_route(
    review_id: int,
    updated_review: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    review = get_review_by_id(db, review_id)

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    return update_review(
        db,
        review,
        updated_review
    )

@router.delete("/{review_id}")
def delete_review_route(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    review = get_review_by_id(db, review_id)

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    delete_review(db, review)

    return {
        "message": "Review deleted successfully"
    }