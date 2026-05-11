from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.review import Review
from schemas.ReviewCreate import ReviewCreate
from schemas.ReviewUpdate import ReviewUpdate
from utils.dependencies import get_current_user
from models.user import User

def create_review(
    db: Session,
    review_data: ReviewCreate,
    user_id: int
):
    new_review = Review(
        rating=review_data.rating,
        comment=review_data.comment,
        university_id=review_data.university_id,
        user_id=user_id
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review

def get_reviews_by_university(db: Session, university_id: int):
    return db.query(Review).filter(
        Review.university_id == university_id
    ).all()
    
def delete_review(
    db: Session,
    review: Review
):
    db.delete(review)
    db.commit()
    
def update_review(
    db: Session,
    review: Review,
    updated_data: ReviewUpdate
):
    if updated_data.rating is not None:
        review.rating = updated_data.rating

    if updated_data.comment is not None:
        review.comment = updated_data.comment

    db.commit()
    db.refresh(review)

    return review

def get_review_by_id(
    db: Session,
    id: int
):
    review = db.query(Review).filter(Review.id == id).first()
    return review