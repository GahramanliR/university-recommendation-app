from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.university import University
from schemas.UniversityCreate import UniversityCreate
from schemas.UniversityUpdate import UniversityUpdate

def get_all_universities(db: Session):
    return db.query(University).all()

def get_top_universities(db: Session):
    universities = db.query(University).all()
    result = []
    for university in universities:
        if not university.reviews:
            continue
        average = sum(
            review.rating for review in university.reviews
        ) / len(university.reviews)
        result.append({
            "id": university.id,
            "name": university.name,
            "country": university.country,
            "city": university.city,
            "average_rating": round(average, 2)
        })
    result.sort(
        key=lambda university: university["average_rating"],
        reverse=True
    )
    return result

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
    db.delete(university)
    db.commit()
    
    return university