from db import engine
from models import Base


def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print(" Tables dropped.")
    Base.metadata.create_all(bind=engine)
    print(" Tables created.")

if __name__ == "__main__":
    reset_database()