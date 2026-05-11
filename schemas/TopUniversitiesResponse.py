from pydantic import BaseModel

class TopUniversityResponse(BaseModel):
    id: int
    name: str
    country: str
    city: str
    average_rating: float
    review_count: int
    
    class Config:
        from_attributes = True