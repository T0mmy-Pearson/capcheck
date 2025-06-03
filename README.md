# capcheck

Setting Up .env.test File:
Create a .env.test file inside the data directory
Inside that file add:
DATABASE_URL=postgresql://{YOUR_PSQL_USERNAME}:{YOUR_PSQL_PASSWORD}@localhost:5432/test_capcheck_database
PGUSER={YOUR_PSQL_USERNAME}
PGPASSWORD={YOUR_PSQL_PASSWORD}

To run a file:

CD into backend/
In the terminal write PYTHONPATH=. then your absolute route, e.g. PYTHONPATH=. python3 app/data/seed.py to run a file.
To run a test write PYTHONPATH=. then your absolute route, e.g, PYTHONPATH=. pytest app/tests
