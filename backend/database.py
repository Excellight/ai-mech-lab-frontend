"""Database configuration for AI Mech Lab.

Supports either a complete PostgreSQL DATABASE_URL (recommended for Supabase)
OR the existing DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD settings.
Credentials must be supplied through environment variables, never hard-coded.
"""

import os
from pathlib import Path
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL, make_url
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


# Load backend/.env when running locally. Deployment platforms can provide
# environment variables directly; those values take precedence.
BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(BACKEND_DIR / ".env", override=False)


def _build_database_url() -> URL:
    """Build a SQLAlchemy PostgreSQL URL from DATABASE_URL or DB_* settings."""
    database_url_value = os.getenv("DATABASE_URL", "").strip()

    if database_url_value:
        try:
            url = make_url(database_url_value)
        except Exception as exc:
            raise ValueError(
                "DATABASE_URL is not a valid PostgreSQL connection URL. "
                "Copy the connection string from Supabase Dashboard > Connect."
            ) from exc

        # Supabase and many hosts provide postgresql:// URLs. Explicitly select
        # psycopg 3, which is the driver declared in requirements.txt.
        if url.drivername in {"postgres", "postgresql"}:
            url = url.set(drivername="postgresql+psycopg")
        elif url.drivername == "postgresql+psycopg2":
            url = url.set(drivername="postgresql+psycopg")

        if not url.drivername.startswith("postgresql"):
            raise ValueError("DATABASE_URL must point to a PostgreSQL database.")

        # Supabase requires SSL for hosted database connections.
        host = (url.host or "").lower()
        if ("supabase.co" in host or "pooler.supabase.com" in host) and not url.query.get("sslmode"):
            url = url.update_query_dict({"sslmode": "require"})

        return url

    # Backward-compatible configuration for the existing DB_* environment.
    host = os.getenv("DB_HOST", "localhost").strip()
    port_value = os.getenv("DB_PORT", "5432").strip()
    database = os.getenv("DB_NAME", "ai_mech_lab").strip()
    username = os.getenv("DB_USER", "postgres").strip()
    password = os.getenv("DB_PASSWORD")

    if not all((host, database, username, password)):
        raise ValueError(
            "Database settings are incomplete. Set DATABASE_URL, or provide "
            "DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD."
        )

    try:
        port = int(port_value)
        if not 1 <= port <= 65535:
            raise ValueError
    except (TypeError, ValueError):
        raise ValueError("DB_PORT must be between 1 and 65535.") from None

    query = {}
    if "supabase.co" in host.lower() or "pooler.supabase.com" in host.lower():
        query["sslmode"] = "require"

    return URL.create(
        drivername="postgresql+psycopg",
        username=username,
        password=password,
        host=host,
        port=port,
        database=database,
        query=query,
    )


DATABASE_URL = _build_database_url()

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Shared declarative base for all AI Mech Lab database models."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that provides and reliably closes a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
