from pydantic import BaseModel

class UniversityCreate(BaseModel):
    name: str
    country: str
    city: str