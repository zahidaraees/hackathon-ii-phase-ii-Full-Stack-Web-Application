from sqlmodel import SQLModel
from .session import engine

def create_db_and_tables():
    """
    Creates the database and all tables based on the SQLModel models
    """
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    create_db_and_tables()