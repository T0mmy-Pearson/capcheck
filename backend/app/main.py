from fastapi import FastAPI
import psycopg2 
import os
from typing import Union
import requests
import json

app=FastAPI()
conn = psycopg2.connect(
    dbname = "test_capcheck_database", 
    user = os.getenv("PGUSER"),
    password = os.getenv("PGPASSWORD"),
    host = "localhost",
    port = 5432
)
conn.autocommit = True

cur = conn.cursor()

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
    