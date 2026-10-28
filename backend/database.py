
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Load environment variables from backend/.env
BACKEND_DIR = Path(__file__).resolve().parent
ENV_FILE = BACKEND_DIR / ".env"
load_dotenv(ENV_FILE)

# Read PostgreSQL configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT_VALUE = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "ai_mech_lab")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Validate required configuration
if not all([DB_HOST, DB_NAME, DB_USER, DB_PASSWORD]):
    raise ValueError(
        "Database settings are incomplete. "
        "Check DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD "
        "in backend/.env."
    )

try:
    DB_PORT = int(DB_PORT_VALUE)
    if not 1 <= DB_PORT <= 65535:
        raise ValueError
except (TypeError, ValueError):
    raise ValueError(
        "DB_PORT must be a valid port number between 1 and 65535."
    ) from None

# Build the connection URL safely, including special characters
# in the username or password.
DATABASE_URL = URL.create(
    drivername="postgresql+psycopg",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
)

# Create the SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

# Create database sessions
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


# Shared base class for all database models
class Base(DeclarativeBase):
    pass


# Dependency for FastAPI database endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
