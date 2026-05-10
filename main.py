from fastapi import FastAPI
from database import engine, Base
from api import universities, reviews

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(universities.router)
app.include_router(reviews.router)

@app.get("/")
async def root():
    return {"message": "API is running"}