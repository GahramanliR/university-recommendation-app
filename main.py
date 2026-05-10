from fastapi import FastAPI, Depends
from database import engine, Base, get_db
from models.university import University
from schemas.UniversityCreate import UniversityCreate
from sqlalchemy.orm import Session
from api import universities

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(universities.router);

@app.get("/")
async def root():
    return {"message": "API is running"}