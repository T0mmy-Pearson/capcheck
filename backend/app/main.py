from fastapi import FastAPI
import psycopg2 
import os


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

@app.get("/api/mushroom")
async def fetch_mushrooms():
    cur.execute("SELECT * FROM mushroom")
    results=cur.fetchall()
    records = []
    for row in results:
        record = {}
        for i, column in enumerate(cur.description):
            record[column.name]=row[i]
        records.append(record)
    return { "mushrooms":records }