from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.university import University
from schemas.UniversityCreate import UniversityCreate
from schemas.UniversityResponse import UniversityResponse
from schemas.UniversityUpdate import UniversityUpdate
from schemas.UniversityWithReviews import UniversityWithReviews

from crud.university import (
    get_all_universities,
    get_university_by_id,
    create_university,
    update_university,
    delete_university,
    search_universities,
    get_recommended_universities
)

router = APIRouter(
    prefix="/universities",
    tags=["universities"]
)

@router.get("/", response_model=list[UniversityResponse])
def find_universities(
    db: Session = Depends(get_db),
    page: int = 1,
    limit: int = 10
):
    return get_all_universities(db, page, limit)

@router.get("/recommendations")
def recommendations(
    db: Session = Depends(get_db)
):
    return get_recommended_universities(db)

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

@router.get("/discover")
def discover_universities(
    db: Session = Depends(get_db),
    name: str | None = None,
    country: str | None = None,
    city: str | None = None,
    sort: str = "rank"
):
    universities = search_universities(db, name, country, city)

    result = []

    all_ratings = []
    for u in universities:
        for r in u.reviews:
            all_ratings.append(r.rating)

    C = sum(all_ratings) / len(all_ratings) if all_ratings else 0
    m = 5

    for u in universities:
        v = len(u.reviews)

        R = (
            sum(r.rating for r in u.reviews) / v
            if v else 0
        )
        score = (
            (v / (v + m)) * R +
            (m / (v + m)) * C
        ) if v else C

        result.append({
            "id": u.id,
            "name": u.name,
            "country": u.country,
            "city": u.city,
            "average_rating": round(R, 2),
            "review_count": v,
            "score": round(score, 2)
        })

    if sort == "rating":
        result.sort(key=lambda x: x["average_rating"], reverse=True)
    elif sort == "reviews":
        result.sort(key=lambda x: x["review_count"], reverse=True)
    else:
        result.sort(key=lambda x: x["score"], reverse=True)

    return result

@router.get("/{id}", response_model=UniversityWithReviews)
def get_by_id(
    id: int, 
    db: Session = Depends(get_db)
):
    university = get_university_by_id(id, db)

    if not university:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )
    average = None
    if (university.reviews):
        average = sum(
        review.rating for review in university.reviews
        ) / len(university.reviews)
    
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
def delete(
    id: int,
    db: Session = Depends(get_db)
):
    university = get_university_by_id(id, db)

    if not university:
        raise HTTPException(
            status_code=404,
            detail="University not found"
        )

    delete_university(db, university)

    return {"message": "Deleted successfully"}