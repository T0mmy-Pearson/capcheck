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