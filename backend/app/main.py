from fastapi import FastAPI
import psycopg2 
import os
import psycopg2.extras

app=FastAPI()
conn = psycopg2.connect(
    dbname = "test_capcheck_database", 
    user = os.getenv("PGUSER"),
    password = os.getenv("PGPASSWORD"),
    host = "localhost",
    port = 5432
)
conn.autocommit = True
cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

@app.get("/api/mushroom")
async def fetch_mushrooms():
    cur.execute("SELECT * FROM mushroom")
    results=cur.fetchall()
    print(results)
    return results



