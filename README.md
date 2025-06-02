# capcheck
Setting Up .env.test File:
    Create a .env.test file inside the data directory
    Inside that file add:
                        DATABASE_URL=postgresql://{YOUR_PSQL_USERNAME}:{YOUR_PSQL_PASSWORD}@localhost:5432/test_capcheck_database
                        PGUSER={YOUR_PSQL_USERNAME}
                        PGPASSWORD={YOUR_PSQL_PASSWORD}
