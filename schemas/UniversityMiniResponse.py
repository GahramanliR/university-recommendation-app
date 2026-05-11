from pydantic import BaseModel

class UniversityMini(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True