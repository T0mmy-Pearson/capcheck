import psycopg2
import os

conn = psycopg2.connect(
    dbname = "postgres", 
    user = os.getenv("PGUSER"),
    password = os.getenv("PGPASSWORD"),
    host = os.getenv("PGHOST"),
    port = os.getenv("PGPORT")
)

conn.autocommit = True
cur = conn.cursor()
cur.execute("DROP DATABASE IF EXISTS test_capcheck_database")
cur.execute("CREATE DATABASE test_capcheck_database")

print("Database successfully created")

cur.close()
conn.close()
