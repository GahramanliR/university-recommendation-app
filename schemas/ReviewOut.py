from pydantic import BaseModel
from typing import Optional
from .UniversityMiniResponse import UniversityMini

class ReviewOut(BaseModel):
    id: int
    rating: int
    comment: str
    university: Optional[UniversityMini] = None

    class Config:
        from_attributes = True