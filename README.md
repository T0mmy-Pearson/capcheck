# capcheck

Setting Up .env.test File:
    Create a .env.test file inside the data directory
    Inside that file add:
                        DATABASE_URL=postgresql://{YOUR_PSQL_USERNAME}:{YOUR_PSQL_PASSWORD}@localhost:5432/test_capcheck_database
                        PGUSER={YOUR_PSQL_USERNAME}
                        PGPASSWORD={YOUR_PSQL_PASSWORD}

How to check your PSQL Username and Password

1. Type psql in terminal
2. \password postgres - type (you won't see it, which is normal) - it will prompt you to write it twice 
3. Username is whatever is listed in your terminal excluding the =#

Create a .env.test file inside the data directory
Inside that file add:
DATABASE_URL=postgresql://{YOUR_PSQL_USERNAME}:{YOUR_PSQL_PASSWORD}@localhost:5432/test_capcheck_database
PGUSER={YOUR_PSQL_USERNAME}
PGPASSWORD={YOUR_PSQL_PASSWORD}

To access all Libraries that we've imported:
in the terminal --- > source venv/bin/activate --> to open the virtual environment and run any of the Pyton files. 

To run a file:

CD into backend/
In the terminal write PYTHONPATH=. then your absolute route, e.g. PYTHONPATH=. python3 app/data/seed.py to run a file.
To run a test write PYTHONPATH=. then your absolute route, e.g, PYTHONPATH=. pytest app/tests

