
from fastapi import FastAPI
import psycopg2 
import os
from typing import Union
from fastapi import requests, Query
from pydantic import BaseModel
from app.data.db import engine
from app.data.models import UserPhotos, UserComments, Users, UserLikes
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware


env = os.getenv("ENV", "production")
env_file = f".env.{env}" if env != "production" else ".env.production"
env_path = Path(__file__).resolve().parent / "data" / env_file
load_dotenv(dotenv_path=env_path)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Photo(BaseModel):
    photo: str
    latitude: str
    longitude: str
    mushroomId: int

class Comment(BaseModel):
    body: str

class UpdateUser(BaseModel):
    score: Union[int, None] = None
    username: Union[str, None] = None
    avatar: Union[str, None] = None


conn = psycopg2.connect(
    dbname = os.getenv("PGNAME"), 
    user = os.getenv("PGUSER"),
    password = os.getenv("PGPASSWORD"),
    host = os.getenv("PGHOST"),
    port = os.getenv("PGPORT")
)
conn.autocommit = True

cur = conn.cursor()


@app.get("/api")
async def root():
    return {
        "message": "Welcome to the Mushroom Community API",
        "endpoints": {
            "users": "/api/users",
            "userphotos": "/api/userphotos",
            "mushrooms": "/api/mushrooms",
            "comments": "/api/comments"
        }
    }

@app.get("/api/mushroom/")
async def fetch_mushrooms(edible: Union[str, None] = None):
    sql_str = "SELECT * FROM mushroom"
    sql_data = []
    if edible:
        sql_str += " WHERE UPPER (edible) = UPPER (%s);"
        sql_data.append(edible)
    cur.execute(sql_str, sql_data)
    results=cur.fetchall()
    records = []
    for row in results:
        record = {}
        for i, column in enumerate(cur.description):
            record[column.name]=row[i]
        records.append(record)
    return { "mushrooms":records }

@app.get("/api/mushroom/{mushroomId}")
async def fetch_mushroom_by_Id(mushroomId: int):
    sql_str = 'SELECT * FROM mushroom WHERE "mushroomId" = %s'
    sql_data = [mushroomId]
    cur.execute(sql_str, sql_data)
    result=cur.fetchone()
    record = {}
    for i, column in enumerate(cur.description):
        record[column.name] = result[i]
    return { "mushroom": record}

@app.get("/api/users")
async def fetch_users():
    sql_str = "SELECT * FROM users"
    cur.execute(sql_str)
    results=cur.fetchall()
    records = []
    for row in results:
        record = {}
        for i, column in enumerate(cur.description):
            record[column.name]=row[i]
        records.append(record)
    return { "users": records }


@app.get("/api/userphotos")
async def fetch_user_photos(user_id: int = Query(1)):
    try:
        sql = """
        SELECT 
            p."photoId",
            p.photo,
            p.latitude,
            p.longitude,
            p."mushroomId",
            m.name AS mushroom_name,
            u."userId" AS user_id,
            u.username,
            u.avatar AS avatar_url,
            COUNT(l."likeId") AS likes,
            EXISTS (
                SELECT 1 FROM likes l2
                WHERE l2."photoId" = p."photoId" AND l2."userId" = %s
            ) AS liked
        FROM userphotos p
        JOIN users u ON u."userId" = p."userId"
        JOIN mushroom m ON m."mushroomId" = p."mushroomId"
        LEFT JOIN likes l ON l."photoId" = p."photoId"
        GROUP BY p."photoId", m.name, u."userId", u.username, u.avatar, p.photo, p.latitude, p.longitude, p."mushroomId";
        """
        cur.execute(sql, (user_id,))
        results = cur.fetchall()

        records = []
        for row in results:
            record = {column.name: row[i] for i, column in enumerate(cur.description)}

            records.append({
                "id": record["photoId"],
                "photoUrl": record["photo"],
                "user": {
                    "username": record["username"],
                    "avatarUrl": record["avatar_url"]
                },
                "caption": record["mushroom_name"],  
                "latitude": record["latitude"],
                "longitude": record["longitude"],
                "mushroomId": record["mushroomId"],
                "likes": record["likes"],
                "liked": record["liked"],
                "timestamp": "Just now",
                "comments": []
            })

        return {"userphotos": records}

    except Exception as e:
        print("Error in /api/userphotos:", e)
        return {"error": "Failed to load user photos"}

@app.get("/api/users/{userId}")
async def fetch_user_by_id(userId: int):
    sql_str = 'SELECT * FROM users WHERE "userId" = %s'
    sql_data = [userId]
    cur.execute(sql_str, sql_data) 
    result=cur.fetchone()
    record = {}
    for i, column in enumerate(cur.description):
        record[column.name] = result[i]
    return { "user": record }

@app.get("/api/users/{userId}/userphotos")
async def fetch_user_photos(userId: int):
    sql_str = 'SELECT * FROM userphotos WHERE "userId" = %s'
    sql_data = [userId]
    cur.execute(sql_str, sql_data)
    results=cur.fetchall()
    records = []
    for row in results:
        record = {}
        for i, column in enumerate(cur.description):
            record[column.name]=row[i]
        records.append(record)
    return { "userphotos": records }

@app.get("/api/userphotos/{photoId}/usercomments")
async def fetch_user_photos(photoId: int):
    sql_str = 'SELECT * FROM usercomments WHERE "photoId" = %s'
    sql_data = [photoId]
    cur.execute(sql_str, sql_data)
    results=cur.fetchall()
    records = []
    for row in results:
        record = {}
        for i, column in enumerate(cur.description):
            record[column.name]=row[i]
        records.append(record)
    return { "usercomments": records }

@app.get("/api/mushroom/{mushroomId}/location")
async def fetch_mushroom_location(mushroomId: int):
    sql_str = 'SELECT "scientificName" FROM mushroom WHERE "mushroomId" = %s'
    sql_data = [mushroomId]
    cur.execute(sql_str, sql_data)
    result=cur.fetchone()
    record = {}
    for i, column in enumerate(cur.description):
        record[column.name] = result[i]
    scientific_name = "%20".join(record["scientificName"].split(" "))
    species_code = requests.get("https://api.gbif.org/v1/species/match?scientificName=%s"%scientific_name).json()
    location_data = requests.get("https://api.gbif.org/v1/occurrence/search?taxonKey=%s&country=GB"%species_code["usageKey"]).json()
    location_list = []
    for result in location_data['results']:
        location_list.append([result["decimalLatitude"], result["decimalLongitude"]])
    return { "results": location_list}

@app.post("/api/users/{user_id}/userphotos", status_code = 201)
async def post_user_photo(user_id: int,user_photos: Photo):
    session = Session(bind=engine)
    new_photo = UserPhotos(
        photo = user_photos.photo,
        userId = user_id,
        latitude = user_photos.latitude,
        longitude = user_photos.longitude,
        mushroomId= user_photos.mushroomId,
    )
    session.add(new_photo)
    session.commit()
    return{"message": "photo added seccessfully"}

@app.post("/api/users/{user_id}/userphotos/{photoId}", status_code = 201)
async def post_photo_comment(user_id: int, photoId: int, photo_comment: Comment):
    session = Session(bind=engine)
    new_comment = UserComments(
        body = photo_comment.body,
        userId = user_id,
        photoId = photoId,
    )
    session.add(new_comment)
    session.commit()
    return{"message": "comment added seccessfully"}

@app.delete("/api/users/{user_id}/userphotos/{photoId}", status_code = 204)
async def delete_user_photo(user_id: int, photoId: int):
    session = Session(bind=engine)
    photo = session.query(UserPhotos).filter_by(photoId = photoId).first()
    session.delete(photo)
    session.commit()
    session.close()

@app.patch("/api/users/{user_id}")
async def update_user(user_id: int, new_user: UpdateUser):
    session = Session(bind=engine)
    user=session.get(Users, user_id)
    if new_user.score is not None: 
        user.score=new_user.score
    if new_user.avatar is not None:
        user.avatar=new_user.avatar
    if new_user.username is not None:
        user.username=new_user.username
    session.commit()
    session.refresh(user)
    return {
        'userId': user.userId, 
        'username': user.username,
        'avatar': user.avatar,
        'score': user.score,
    }

@app.post("/api/userphotos/{photoId}/like", status_code=201)
async def like_photo(photoId: int, user_id: int = Query(...)):
    session = Session(bind=engine)
    existing_like = session.query(UserLikes).filter_by(userId=user_id, photoId=photoId).first()
    if existing_like:
        return {"message": "Photo already liked"}

    new_like = UserLikes(userId=user_id, photoId=photoId)
    session.add(new_like)
    session.commit()
    session.close()
    return {"message": "Photo liked successfully"}

@app.delete("/api/userphotos/{photoId}/like", status_code=204)
async def unlike_photo(photoId: int, user_id: int = Query(...)):
    session = Session(bind=engine)
    like = session.query(UserLikes).filter_by(userId=user_id, photoId=photoId).first()
    if like:
        session.delete(like)
        session.commit()
    session.close()

@app.get("/api/userphotos/{photoId}/likes")
async def get_photo_likes(photoId: int):
    session = Session(bind=engine)
    like_count = session.query(UserLikes).filter_by(photoId=photoId).count()
    liked_users = (
        session.query(Users.userId, Users.username, Users.avatar)
        .join(UserLikes, Users.userId == UserLikes.userId)
        .filter(UserLikes.photoId == photoId)
        .all()
    )

    users_list = []
    for user in liked_users:
        users_list.append({
            "userId": user.userId,
            "username": user.username,
            "avatar": user.avatar
        })

    session.close()
    return {
        "photoId": photoId,
        "likeCount": like_count,
        "likedBy": users_list
    }