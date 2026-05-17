from pydantic import BaseModel

class UniversityUpdate(BaseModel):
    name: str | None = None
    country: str | None = None
    city: str | None = None