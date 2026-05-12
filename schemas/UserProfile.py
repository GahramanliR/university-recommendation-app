from pydantic import BaseModel
from typing import List
from .ReviewOut import ReviewOut

class UserProfile(BaseModel):
    id: int
    username: str
    total_reviews: int
    reviews: List[ReviewOut]

    class Config:
        from_attributes = True