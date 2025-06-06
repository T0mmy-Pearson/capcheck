import json 
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session 
from app.data.db import engine
from app.data.models import Mushroom, Users, UserPhotos, UserComments, Base
from pathlib import Path

# Load environment-specific .env file
env = os.getenv("ENV", "test")
env_file = f".env.{env}" if env != "production" else ".env.production"
env_path = Path(__file__).resolve().parent / env_file
load_dotenv(dotenv_path=env_path)

# Now load ENV again after .env is loaded
env = os.getenv("ENV", "test")
print(f"Seeding for environment: {env}")

# Set path to data directory depending on environment
data_folder = Path(__file__).resolve().parent / ("test_data" if env == "test" else "prod_data")


def seed_data():
    print("Resetting database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables dropped and recreated.")

    session = Session(bind=engine)

    
    with open(data_folder / "mushroom_data.json", "r") as file:
        mushroom_data = json.load(file)

    with open(data_folder / "user_data.json", "r") as file:
        user_data = json.load(file)

    with open(data_folder / "userPhotos_data.json", "r") as file:
        user_photo_data = json.load(file) 

    with open(data_folder / "comments_data.json", "r") as file:
        comments_data = json.load(file)

    for data in mushroom_data["mushrooms"]:
        mushrooms = Mushroom(
            name=data.get("name"),
            scientificName=data.get("scientificName"),
            description=data.get("description"),
            cap=data.get("cap"),
            stem=data.get("stem"),
            gills=data.get("gills"),
            pores=data.get("pores"),
            flesh=data.get("flesh"),
            habitat=data.get("habitat"),
            otherFacts=data.get("otherFacts"),
            start=data.get("start"),
            end=data.get("end"),
            capHeight=data.get("capHeight"),
            capWidth=data.get("capWidth"),
            edible=data.get("edible"),
            imgUrl=data.get("imgUrl")
        )
        session.add(mushrooms)

    for data in user_data["users"]:
        user = Users(
            username=data["username"],
            avatar=data["avatar"],
            score=data["score"]
        )
        session.add(user)  
        session.commit()

    for data in user_photo_data["userphotos"]:
         photo = UserPhotos(
              latitude=data["latitude"],
              longitude=data["longitude"],
              photo=data["photo"],
              userId=data["userId"],
              mushroomId=data["mushroomId"],
        )
         session.add(photo)
    session.commit()
    for data in comments_data["usercomments"]:
        comment = UserComments(
            photoId=data["photoId"],
            userId=data["userId"],
            body=data["body"],
        )
        session.add(comment)
    session.commit()
    session.close()

if __name__ == "__main__":
    seed_data()