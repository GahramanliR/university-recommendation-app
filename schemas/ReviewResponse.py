from pydantic import BaseModel
from .UserMiniResponse import UserMini
from .UniversityMiniResponse import UniversityMini

class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: str
    user: UserMini
    university: UniversityMini

    class Config:
        from_attributes = True