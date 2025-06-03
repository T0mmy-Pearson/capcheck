import pytest
from sqlalchemy import inspect
from app.data.db import engine
from app.data.models import Mushroom, Users, UserPhotos
from app.data.seed import seed_data

@pytest.fixture(scope="module", autouse=True)
def setup_and_seed():
    seed_data()  
    yield
# means the same as before all seed database

def test_tables_exist():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    assert "mushroom" in tables
    assert "users" in tables
    assert "userPhotos" in tables

def test_mushroom_columns():
    inspector = inspect(engine)
    columns = inspector.get_columns("mushroom")
    column_names = {col['name'] for col in columns}
    expected = {
        "mushroomId", "mushroomName", "imgUrl", "description", "scientificName",
        "startMonth", "endMonth", "capWidth", "capHeight"
    }
    assert expected.issubset(column_names)