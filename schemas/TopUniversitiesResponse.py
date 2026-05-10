from pydantic import BaseModel

class TopUniversityResponse(BaseModel):
    id: int
    name: str
    country: str
    city: str
    average_rating: float
    
    class Config:
        from_attributes = True