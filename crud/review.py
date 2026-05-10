from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.review import Review
from schemas.ReviewCreate import ReviewCreate

def create_review(
    db: Session,
    review_data: ReviewCreate
):
    new_review = Review(
        rating = review_data.rating,
        comment = review_data.comment,
        university_id = review_data.university_id
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review
def get_reviews_by_university(db: Session, university_id: int):
    return db.query(Review).filter(
        Review.university_id == university_id
    ).all()