import json 
from sqlalchemy.orm import Session 
from db import engine
from models import Mushroom, Users, UserPhotos

with open("test_mushroom_data.json", "r") as file:
    mushroom_data = json.load(file) 

with open("test_user_data.json", "r") as file:
    user_data = json.load(file)

with open("test_userPhotos_data.json", "r") as file:
    user_photo_data = json.load(file)

def seed_data():
    session = Session(bind=engine)
    for data in mushroom_data["mushroom"]: 
        mushroom = Mushroom(
            mushroomName=data["mushroomName"],
            imgUrl=data["imgUrl"],
            description=data["description"],
            scientificName=data["scientificName"],
            startMonth=data["startMonth"],
            endMonth=data["endMonth"],
            capWidth=data["capWidth"],
            capHeight=data["capHeight"],
        )
        session.add(mushroom)
    for data in user_data["users"]:
        user = Users(
            userId=data["userId"],
            username=data["username"],
            avatar=data["avatar"],
            score=data["score"]
        )
        session.add(user)
    session.commit()
    session.close() 
    print("Seeding Successful")       
seed_data()

def seed_photo():
    session = Session(bind=engine)
    for data in user_photo_data["user photos"]:
         photo = UserPhotos(
              photoId=data["photoId"],
              userId=data["userId"],
              location=data["location"],
              mushroomId=data["mushroomId"]
        )
         session.add(photo)
    session.commit()
    session.close()
seed_photo()