from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class University(Base):
    __tablename__ = "universities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    country = Column(String)
    city = Column(String)
    
    reviews = relationship("Review", back_populates="university")