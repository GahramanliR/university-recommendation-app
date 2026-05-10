from pydantic import BaseModel

class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: str

    class Config:
        from_attributes = True