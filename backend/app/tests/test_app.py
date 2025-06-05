import pytest
from app.main import app
from fastapi.testclient import TestClient 
from sqlalchemy import inspect
from app.data.db import engine
from app.data.models import Mushroom, Users, UserPhotos
from app.data.seed import seed_data
from app.data.models import Base
from sqlalchemy.orm import Session
from sqlalchemy import Integer, String, Text
import json


mushroom_data = {
  "mushrooms": [
    {
      "name": "mushroom1",
      "mushroomId": 1,
      "imgUrl": "a",
      "description": "This is a description",
      "scientificName": "Interestigus Mushromgus",
      "start": "June",
      "end": "July",
      "capWidth": "3mm",
      "capHeight": "4mm",
      "edible": "edible",
      "cap": "brown cap thing",
      "flesh": "flesh input",
      "gills": "gills input",
      "habitat": "the woods",
      "otherFacts": "random info",
      "pores": "porous info",
      "stem": "stem info"
    },
    {
      "name": "mushroom2",
      "mushroomId": 2,
      "imgUrl": "b",
      "description": "This is a description",
      "scientificName": "Interestigus Mushromgus",
      "start": "all",
      "end": "all",
      "capWidth": "4mm",
      "capHeight": "1mm",
      "edible": "Poisonous",
      "cap": "brown cap thing",
      "flesh": "flesh input",
      "gills": "gills input",
      "habitat": "the woods",
      "otherFacts": "random info",
      "pores": "porous info",
      "stem": "stem info"
    },
    {
      "name": "mushroom3",
      "mushroomId": 3,
      "imgUrl": "c",
      "description": "This is a description",
      "scientificName": "Interestigus Mushromgus",
      "start": "September",
      "end": "December",
      "capWidth": "2mm",
      "capHeight": "1mm",
      "edible": "inedible",
      "cap": "brown cap thing",
      "flesh": "flesh input",
      "gills": "gills input",
      "habitat": "the woods",
      "otherFacts": "random info",
      "pores": "porous info",
      "stem": "stem info"
    }
  ]
}

user_data = {
    "users":[
        {
            "userId": 1,
            "username": "TestUser",
            "avatar": "url",
            "score": 5
        },
          {
            "userId": 2,
            "username": "Schroom",
            "avatar": "url",
            "score": 13
        },
          {
            "userId": 3,
            "username": "mushyShrooms",
            "avatar": "url",
            "score": 2
        }
    ]
}

user_photos = {
    "userphotos":[
        {
            "photo": "photo_url",
            "photoId": 1,
            "userId": 1,
            "location": "n50 w40",
            "mushroomId": 1
        },
          {
            "photo": "photo2_url",
            "photoId": 2,
            "userId": 2,
            "location": "n56 w41",
            "mushroomId": 2
        },
          {
            "photo": "photo3_url",
            "photoId": 3,
            "userId": 3,
            "location": "n59 w12",
            "mushroomId": 3
          },
          {
            "photo": "photo5_url",
            "photoId": 4,
            "userId": 1,
            "location": "n55 w46",
            "mushroomId": 3
          }
    ]
}

user_comments = {
    "usercomments":[
        {
            "photoId": 2,
            "userId": 1,
            "body": "twelve",
            "commentId": 1
        },
          {
            "photoId": 1,
            "userId": 2,
            "body": "albatross",
            "commentId": 2
        },
          {
            "photoId": 1,
            "userId": 2,
            "body": "vapour",
            "commentId": 3
          },
          {
            "photoId": 3,
            "userId": 3,
            "body": "throw",
            "commentId": 4 
          }
    ]
}

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_and_seed():
    seed_data()  
    yield

def test_get_mushrooms():
    response=client.get("/api/mushroom")
    assert response.status_code == 200
    assert response.json() == mushroom_data

def test_get_edible_mushrooms():
    response=client.get("/api/mushroom?edible=edible")
    assert response.status_code == 200
    assert response.json() == {"mushrooms": [mushroom_data["mushrooms"][0]]}

def test_get_poisonous_mushrooms():
    response=client.get("/api/mushroom?edible=poisonous")
    assert response.status_code == 200
    assert response.json() == {"mushrooms": [mushroom_data["mushrooms"][1]]}

def test_get_inedible_mushrooms():
    response=client.get("/api/mushroom?edible=inedible")
    assert response.status_code == 200
    assert response.json() == {"mushrooms": [mushroom_data["mushrooms"][2]]}

def test_get_mushroom_by_Id():
    response=client.get("/api/mushroom/1")
    assert response.status_code == 200
    assert response.json() == {"mushroom": mushroom_data["mushrooms"][0]}

def test_get_all_users():
    response=client.get("/api/users")
    assert response.status_code == 200
    assert response.json() == user_data

def test_get_user_by_id():
    response=client.get("/api/users/1")
    assert response.status_code == 200
    assert response.json() == {"user": user_data["users"][0]}

def test_get_user_photos():
    response=client.get("/api/users/1/userphotos")
    assert response.status_code == 200
    assert response.json() == {"userphotos": [user_photos["userphotos"][0], user_photos["userphotos"][3]]}

def test_get_photos_comments():
    response=client.get("/api/userphotos/1/usercomments")
    assert response.status_code == 200 
    assert response.json() == {"usercomments": [user_comments["usercomments"][1],user_comments["usercomments"][2]]}

    