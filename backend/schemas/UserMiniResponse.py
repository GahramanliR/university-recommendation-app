from pydantic import BaseModel

class UserMini(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True