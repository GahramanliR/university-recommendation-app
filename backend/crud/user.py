from sqlalchemy.orm import Session, joinedload

from models.review import Review
from models.user import User
from schemas.UserCreate import UserCreate

from utils.security import hash_password

def create_user(
    db: Session,
    user_data: UserCreate
):
    new_user = User(
        username=user_data.username,
        hashed_password=hash_password(
            user_data.password
        )
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_by_username(
    db: Session,
    username: str
):
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db, user_id: int):
    return db.query(User)\
        .options(joinedload(User.reviews).joinedload(Review.university))\
        .filter(User.id == user_id)\
        .first()
