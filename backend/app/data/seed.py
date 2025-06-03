import json 
from sqlalchemy.orm import Session 
from app.data.db import engine
from app.data.models import Mushroom, Users, UserPhotos, Base
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

def seed_data():
    print("Resetting database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables dropped and recreated.")

    session = Session(bind=engine)

    
    with open(BASE_DIR / "test_mushroom_data.json", "r") as file:
        mushroom_data = json.load(file)

    with open(BASE_DIR / "test_user_data.json", "r") as file:
        user_data = json.load(file)

    with open(BASE_DIR / "test_user_photo_data.json", "r") as file:
        user_photo_data = json.load(file) 
        
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
    if __name__ == "__main__":
        seed_data()