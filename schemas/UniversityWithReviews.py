from pydantic import BaseModel
from schemas.ReviewResponse import ReviewResponse

class UniversityWithReviews(BaseModel):
    id: int
    name: str
    country: str
    city: str
    
    average_rating: float | None = None

    reviews: list[ReviewResponse]

    class Config:
        from_attributes = True