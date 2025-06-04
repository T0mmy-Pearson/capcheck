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

