from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Mushroom(Base):
    __tablename__ = "mushroom"
    mushroomId = Column(Integer, primary_key=True)
    mushroomName = Column(String, nullable=False)
    imgUrl = Column(String)
    description = Column(Text)
    scientificName = Column(String, nullable=False)
    startMonth = Column(String, nullable=False)
    endMonth = Column(String, nullable=False)
    capWidth = Column(String)
    capHeight = Column(String)
    

class Users(Base):
    __tablename__ = "users"
    userId = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    avatar = Column(String)
    score = Column(Integer, default=0)

class UserPhotos(Base):
    __tablename__ = "userPhotos"
    photo = Column(String)
    photoId = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey("users.userId", ondelete="CASCADE"))
    location = Column(String)
    mushroomId = Column(Integer, ForeignKey("mushroom.mushroomId", ondelete="CASCADE"))