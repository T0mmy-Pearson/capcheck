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

with open("app/data/test_mushroom_data.json", "r") as file:
        mushroom_data = json.load(file)

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_and_seed():
    seed_data()  
    yield

def test_get_mushrooms():
    response=client.get("/api/mushroom")
    assert response.status_code == 200
    assert response.json() == mushroom_data


