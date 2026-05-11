from pydantic import BaseModel

class ReviewUpdate(BaseModel):
    rating: int | None = None
    comment: str | None = None
    