from sqlalchemy.exc import SQLAlchemyError

from backend.database import Base, engine
from backend import database_models


def create_tables():
    """Create missing AI Mech Lab database tables."""

    try:
        Base.metadata.create_all(bind=engine)

        print("Database table creation completed successfully.")

        print("\nTables available:")
        for table_name in sorted(Base.metadata.tables):
            print(f"- {table_name}")

    except SQLAlchemyError as error:
        print("Could not create the database tables.")
        print(f"Database error: {error}")
        raise


if __name__ == "__main__":
    create_tables()
