from database import Base
from sqlalchemy import Column, Integer, String

class University(Base):
    __tablename__ = "universities"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    country = Column(String)
    city = Column(String)
    