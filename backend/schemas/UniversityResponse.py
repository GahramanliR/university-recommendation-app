from pydantic import BaseModel

class UniversityResponse(BaseModel):
    id: int
    name: str
    country: str
    city: str
    class Config:
        from_attributes = True