from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.review import Review
from models.university import University
from schemas.UniversityCreate import UniversityCreate
from schemas.UniversityUpdate import UniversityUpdate

def get_all_universities(
    db: Session,
    page: int,
    limit: int
):
    skip = (page - 1) * limit
    universities = db.query(University).offset(skip).limit(limit).all()
    return universities

def get_university_by_id(id: int, db: Session):
    university = db.query(University).filter(University.id == id).first()
    return university

def create_university(
    db: Session,
    university_data: UniversityCreate
):
    new_university = University(
        name=university_data.name,
        country=university_data.country,
        city=university_data.city
    )

    db.add(new_university)
    db.commit()
    db.refresh(new_university)

    return new_university

def search_universities(
    db: Session,
    name: str | None = None,
    country: str | None = None,
    city: str | None = None
):
    query = db.query(University)

    if name:
        query = query.filter(
            University.name.ilike(f"%{name}%")
        )
    if country:
        query = query.filter(
            University.country.ilike(f"%{country}%")
        )
    if city:
        query = query.filter(
            University.city.ilike(f"%{city}%")
        )

    return query.all()

def update_university(
    db: Session,
    university: University,
    updated_data: UniversityUpdate
):
    if updated_data.name is not None: university.name = updated_data.name
    if updated_data.country is not None: university.country = updated_data.country
    if updated_data.city is not None: university.city = updated_data.city

    db.commit()
    db.refresh(university)

    return university

def delete_university(
    db: Session, 
    university: University
):
    db.query(Review).filter(
        Review.university_id == university.id
    ).delete(synchronize_session=False)

    db.delete(university)
    db.commit()
    
def get_recommended_universities(db: Session):
    universities = db.query(University).all()
    result = []
    all_reviews = []

    for university in universities:
        for review in university.reviews:
            all_reviews.append(review.rating)

    if not all_reviews:
        return []

    C = sum(all_reviews) / len(all_reviews)
    
    m = 5

    for university in universities:
        v = len(university.reviews)
        if v == 0:
            continue
        R = (
            sum(review.rating for review in university.reviews)
            / v
        )
        score = (
            (v / (v + m)) * R
            +
            (m / (v + m)) * C
        )
        result.append({
            "id": university.id,
            "name": university.name,
            "country": university.country,
            "city": university.city,
            "average_rating": round(R, 2),
            "review_count": v,
            "recommendation_score": round(score, 2)
        })
    result.sort(
        key=lambda x: x["recommendation_score"],
        reverse=True
    )

    return result