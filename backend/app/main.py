from fastapi import FastAPI
import psycopg2 
import os
from typing import Union


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
