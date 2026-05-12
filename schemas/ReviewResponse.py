from typing import Optional
from pydantic import BaseModel
from .UserMiniResponse import UserMini
from .UniversityMiniResponse import UniversityMini
from datetime import datetime

class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: str
    user: UserMini
    university: UniversityMini
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True