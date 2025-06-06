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
import os
os.environ["ENV"] = "test"


mushroom_data = {
  "mushrooms": [
    {
      "name": "mushroom1",
      "mushroomId": 1,
      "imgUrl": "a",
      "description": "This is a description",
      "scientificName": "Abortiporus biennis",
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
            "photoId": 1,
            "photo": "photo_url",
            "userId": 1,
            "latitude": "54",
            "longitude": "-4",
            "mushroomId": 1
        },
          {
            "photoId": 2,
            "photo": "photo2_url",
            "userId": 2,
            "latitude": "1",
            "longitude": "1",
            "mushroomId": 2
        },
          {
            "photoId": 3,  
            "photo": "photo3_url",
            "userId": 3,
            "latitude": "34",
            "longitude": "8",
            "mushroomId": 3
          },
          {
            "photoId": 4,  
            "photo": "photo5_url",
            "userId": 1,
            "latitude": "13",
            "longitude": "47",
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

@pytest.fixture(scope="function", autouse=True)
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

def test_get_mushroom_location():
    response=client.get("/api/mushroom/1/location")
    assert response.status_code == 200
    for coord in response.json():
        assert isinstance(coord[0], (str))
        assert isinstance(coord[1], (str))

def test_post_user_photos():
    payload={
        'photo': "testphotourlmonkey",
        'mushroomId': 1,
        'latitude': "52",
        'longitude': "-4"
    }
    response=client.post("/api/users/1/userphotos", json=payload)
    assert response.status_code == 201
    assert response.json() == {"message": "photo added seccessfully"}

def test_post_photos_comments():
    payload={
        "body": "horse"
    }
    response=client.post("/api/users/1/userphotos/1", json=payload)
    assert response.status_code == 201
    assert response.json() == {"message": "comment added seccessfully"}

def test_delete_photo():
    payload={
        'photo': "testphotourlmonkey",
        'mushroomId': 1,
        'latitude': "52",
        'longitude': "-4"
    }
    response=client.post("/api/users/1/userphotos", json=payload)
    assert response.status_code == 201
    response=client.delete("/api/users/1/userphotos/5")
    assert response.status_code == 204
    response=client.get('/api/users/1/userphotos')
    assert response.status_code == 200
    assert len(response.json()["userphotos"]) == 2

def test_patch_users():
    payload={
        'score': 90,
        'username': 'updateduser',
        'avatar': 'updatedavatar'
    }
    response=client.patch("/api/users/1", json=payload)
    assert response.status_code == 200
    data=response.json()
    assert data['userId'] == 1 
    assert data['score'] == 90 
    assert data['username'] == 'updateduser'
    assert data['avatar'] == 'updatedavatar'