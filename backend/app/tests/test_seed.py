import pytest
from sqlalchemy import inspect
from app.data.db import engine
from app.data.models import Mushroom, Users, UserPhotos
from app.data.seed import seed_data
from app.data.models import Base
from sqlalchemy.orm import Session
from sqlalchemy import Integer, String, Text


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
        "mushroomId", "name", "img_url", "description", "scientificName",
        "start", "end", "capWidth", "capHeight", "cap", "stem", "gills", "pores", "flesh", "habitat", "otherFacts", "edible"
    }
    assert expected.issubset(column_names)

def test_users_columns():
    inspector = inspect(engine)
    columns = inspector.get_columns("users")
    column_names = {col["name"] for col in columns}
    expected = {"userId", "username", "avatar", "score"}
    assert expected.issubset(column_names)

def test_usersPhotos():
    inspector = inspect(engine)
    columns = inspector.get_columns("userPhotos")
    column_names = {col["name"] for col in columns}
    expected = {"photoId", "photo", "userId", "location", "mushroomId"}
    assert expected.issubset(column_names)

def test_userPhotos_foreign_keys():
    inspector = inspect(engine)
    fks = inspector.get_foreign_keys("userPhotos")
    assert len(fks) == 2
    assert any(fk["referred_table"] == "users" for fk in fks)
    assert any(fk["referred_table"] == "mushroom" for fk in fks)

def test_mushroom_data_exists():
    session=Session(bind=engine)
    result=session.query(Mushroom).all()
    session.close()
    assert len(result) == 257

def test_users_data_exists():
    session=Session(bind=engine)
    result=session.query(Users).all()
    session.close()
    assert len(result) == 3

def test_userPhotos_data_exists():
    session=Session(bind=engine)
    result=session.query(UserPhotos).all()
    session.close()
    assert len(result) == 4

def test_nullable_mushroom_fields():
    session=Session(bind=engine)
    result=session.query(Mushroom).all()
    session.close()

    for mushroom in result:
        assert mushroom.name is not None
        assert mushroom.scientificName is not None
     
      

def test_nullable_user_fields():
    session=Session(bind=engine)
    result=session.query(Users).all()
    session.close()

    for user in result:
        assert user.username is not None


def test_user_score_zero():
    session=Session(bind=engine)
    user= Users(username="Barbara13")
    session.add(user)
    session.commit()
    retrieve_score=session.query(Users).filter_by(username="Barbara13").first()
    assert retrieve_score.score == 0
    session.delete(retrieve_score)
    session.commit()
    session.close()    

def test_users_column_types():
    inspector=inspect(engine)
    columns=inspector.get_columns("users")
    for col in columns:
        if col["name"] == "userId":
            assert isinstance(col["type"], Integer)
        elif col["name"] == "username":
            assert isinstance(col["type"], String)
        elif col["name"] == "score":
            assert isinstance(col["type"], Integer)
        elif col["name"] == "avatar":
            assert isinstance(col["type"], String)

def test_mushrooms_column_types():
    inspector=inspect(engine)
    columns=inspector.get_columns("mushroom")
    for col in columns:
        if col["name"] == "mushroomId":
            assert isinstance(col["type"], Integer)
        elif col["name"] == "name":
            assert isinstance(col["type"], String)
        elif col["name"] == "img_url":
            assert isinstance(col["type"], String)
        elif col["name"] == "description":
            assert isinstance(col["type"], Text)
        elif col["name"] == "scientificName":
            assert isinstance(col["type"], String)
        elif col["name"] == "start":
            assert isinstance(col["type"], String)
        elif col["name"] == "end":
            assert isinstance(col["type"], String)
        elif col["name"] == "capWidth":
            assert isinstance(col["type"], String)
        elif col["name"] == "capHeight":
            assert isinstance(col["type"], String)
        elif col["name"] == "cap":
            assert isinstance(col["type"], String)
        elif col["name"] == "stem":
            assert isinstance(col["type"], String)
        elif col["name"] == "gills":
            assert isinstance(col["type"], String)
        elif col["name"] == "pores":
            assert isinstance(col["type"], String)
        elif col["name"] == "flesh":
            assert isinstance(col["type"], String)
        elif col["name"] == "habitat":
            assert isinstance(col["type"], String)
        elif col["name"] == "otherFacts":
            assert isinstance(col["type"], String)
        elif col["name"] == "edible":
            assert isinstance(col["type"], String)



def test_userPhotos_column_types():
    inspector=inspect(engine)
    columns=inspector.get_columns("userPhotos")
    for col in columns:
        if col["name"] == "userId":
            assert isinstance(col["type"], Integer)
        elif col["name"] == "photoId":
            assert isinstance(col["type"], Integer)
        elif col["name"] == "mushroomId":
            assert isinstance(col["type"], Integer)
        elif col["name"] == "location":
            assert isinstance(col["type"], String)
        elif col["name"] == "photo":
            assert isinstance(col["type"], String)


def test_primary_keys():
    inspector = inspect(engine)
    users_pk=inspector.get_pk_constraint("users")["constrained_columns"]
    assert users_pk == ["userId"]
    mushroom_pk=inspector.get_pk_constraint("mushroom")["constrained_columns"]
    assert mushroom_pk == ["mushroomId"]
    userPhotos_pk=inspector.get_pk_constraint("userPhotos")["constrained_columns"]
    assert userPhotos_pk == ["photoId"]



