from fastapi import FastAPI
from database import engine, Base
from api import universities, reviews, auth, users
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(universities.router)
app.include_router(reviews.router)
app.include_router(auth.router)
app.include_router(users.router)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@app.get("/")
async def root():
    return {"message": "API is running"}