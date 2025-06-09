from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Mushroom(Base):
    __tablename__ = "mushroom"
    mushroomId = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    scientificName = Column(String, nullable=False)
    description = Column(Text)
    cap = Column(String)
    stem = Column(String)
    gills = Column(String)
    pores = Column(String)
    flesh = Column(String)
    habitat = Column(String)
    otherFacts = Column(Text)
    start = Column(String)
    end = Column(String)
    capHeight = Column(String)
    capWidth = Column(String)
    edible = Column(String)
    imgUrl = Column(String)


class Users(Base):
    __tablename__ = "users"
    userId = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    avatar = Column(String)
    score = Column(Integer, default=0)

class UserPhotos(Base):
    __tablename__ = "userphotos"
    photo = Column(String)
    photoId = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey("users.userId", ondelete="CASCADE"))
    latitude = Column(String)
    longitude = Column(String)
    mushroomId = Column(Integer, ForeignKey("mushroom.mushroomId", ondelete="CASCADE"))

class UserComments(Base):
    __tablename__ = "usercomments"
    commentId = Column(Integer, primary_key=True)
    photoId = Column(Integer, ForeignKey("userphotos.photoId", ondelete="CASCADE"))
    userId = Column(Integer, ForeignKey("users.userId", ondelete="CASCADE"))
    body = Column(Text)

class UserLikes(Base):
    __tablename__ = "likes"
    likeId = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey("users.userId", ondelete="CASCADE"))
    photoId = Column(Integer, ForeignKey("userphotos.photoId", ondelete="CASCADE"))
    __table_args__ = (
        UniqueConstraint("userId", "photoId", name="unique_user_photo_like"),
    )
