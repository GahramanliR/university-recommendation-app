from pydantic import BaseModel

class UniversityIntelligence(BaseModel):
    id: int
    name: str
    internal_average_rating: float
    final_score: float

    class Config:
        from_attributes = True