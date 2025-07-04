import os
from dotenv import load_dotenv
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


env = os.getenv("ENV","production")
env_file = f".env.{env}" if env != "production" else ".env.production"
env_path = Path(__file__).resolve().parent / env_file
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
	raise ValueError("DATABASE_URL environment variable is not set.")

print("DATABASE_URL =", DATABASE_URL)


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()