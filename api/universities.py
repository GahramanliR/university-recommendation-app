from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.university import University
from schemas.UniversityCreate import UniversityCreate
from schemas.UniversityResponse import UniversityResponse
from schemas.UniversityUpdate import UniversityUpdate
from schemas.UniversityWithReviews import UniversityWithReviews
from schemas.TopUniversitiesResponse import TopUniversityResponse

from crud.university import (
    get_all_universities,
    get_university_by_id,
    create_university,
    update_university,
    delete_university,
    search_universities,
    get_top_universities
)

router = APIRouter(
    prefix="/universities",
    tags=["universities"]
)

@router.get("/", response_model=list[UniversityResponse])
def find_universities(db: Session = Depends(get_db)):
    return get_all_universities(db)

@router.get("/top", response_model=list[TopUniversityResponse])
def find_top_universities(
    db: Session = Depends(get_db)
):
    return get_top_universities(db)

@router.post("/", response_model=UniversityResponse)
def create_university_route(
    university: UniversityCreate,
    db: Session = Depends(get_db)
):
    return create_university(db, university)

@router.get("/search", response_model=list[UniversityResponse])
def search(
    name: str | None = None,
    country: str | None = None,
    city: str | None = None,
    db: Session = Depends(get_db)
):
    return search_universities(db, name, country, city)

@router.get("/{id}", response_model=UniversityWithReviews)
def get_by_id(id: int, db: Session = Depends(get_db)):
    university = get_university_by_id(id, db)

    if not university:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )
    average = None
    if (university.reviews):
        sum = 0
        count = 0
        for review in university.reviews:
            sum += review.rating
            count += 1
        average = sum / count
    
    university.average_rating = round(average, 2) if average else None
    return university

@router.put("/{id}", response_model=UniversityResponse)
def update(
    id: int,
    updated_data: UniversityUpdate,
    db: Session = Depends(get_db)
):
    university = get_university_by_id(id, db)

    if not university:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )

    return update_university(db, university, updated_data)

@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    university = get_university_by_id(id, db)

    if not university:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )

    delete_university(db, university)

    return {"message": "Deleted successfully"}