AI Mech Lab — Backend Setup, Troubleshooting and Completion Guide

1. Purpose

This document explains how to set up and run the AI Mech Lab backend, diagnose common errors, and safely complete unfinished implementation work.

Working branch: "backend-foundation"

Important: Do not commit directly to "main". Do not overwrite existing files or remove working functionality without first understanding the impact.

2. Understand the current backend

The backend work includes database models and repositories, Gemini service logic, and Gemini response parsing.

Relevant files include:

- "backend/database.py" — database connection and session configuration.
- "backend/database_models.py" — SQLAlchemy table definitions.
- "backend/pathway_repository.py" — pathway storage and retrieval.
- "backend/lesson_repository.py" — lesson storage and retrieval.
- "backend/video_repository.py" — video-cache storage and retrieval.
- "backend/gemini_service.py" — Gemini configuration and response generation.
- "backend/gemini_response_parser.py" — response parsing and validation.
- "backend/gemini_notes.txt" — instructions for Gemini response types.
- "backend/site_facts.txt" — facts used by the site chatbot.
- "backend/requirements.txt" — Python dependencies.
- "backend/main.py" — FastAPI application entry point, if available in the checked-out branch.

Some files may exist only in a developer's local copy. Check the actual branch before assuming every file has been committed.

3. Environment configuration

Create "backend/.env" locally. Never commit the real file.

Example configuration:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_mech_lab
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

Replace placeholder values with the correct credentials. Confirm the agreed Gemini model before changing it.

If the team needs a template, create "backend/.env.example" with placeholders only.

Ensure ".gitignore" excludes ".env", virtual environments, "__pycache__/", and Python bytecode files. Do not remove existing ignore rules.

4. Install dependencies

From the repository root, create and activate a virtual environment if one is not already configured.

Windows PowerShell:

python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend/requirements.txt

If activation is blocked, use the environment's Python executable directly:

.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt

Run all commands from the repository root unless otherwise specified.

5. Database setup and table creation

1. Open PostgreSQL using pgAdmin or another PostgreSQL client.
2. Confirm that the database "ai_mech_lab" exists.
3. Confirm the credentials and port in "backend/.env".
4. Confirm that "backend/database.py" and "backend/database_models.py" are present.
5. Ensure all models are imported before SQLAlchemy creates the tables.

If a table-creation script is available, run it from the repository root:

python -m backend.create_tables

This command assumes "backend/create_tables.py" exists and its imports are correct. If it does not exist, create and review the script before running the command.

A typical implementation is:

from sqlalchemy.exc import SQLAlchemyError

from backend.database import Base, engine
from backend import database_models


def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database table creation completed.")

        for table_name in sorted(Base.metadata.tables):
            print(f"- {table_name}")

    except SQLAlchemyError as error:
        print(f"Database table creation failed: {error}")
        raise


if __name__ == "__main__":
    create_tables()

The model import is intentional: SQLAlchemy must know about the models before "create_all()" can create their tables.

Expected result: the script finishes without an exception, and the expected tables are visible in pgAdmin.

The current design includes generated pathways, pathway steps, generated lessons, and a video cache. Verify the actual table names against "database_models.py".

Important limitation: "create_all()" creates missing tables but does not update existing tables when model definitions change. Use reviewed Alembic migrations for schema changes to an existing database.

6. Starting the FastAPI application

If "backend/main.py" contains the FastAPI application instance named "app", start it from the repository root:

python -m uvicorn backend.main:app --reload

If Uvicorn is not installed, install the project's requirements first.

Open these URLs in a browser:

- "http://127.0.0.1:8000/"
- "http://127.0.0.1:8000/health"
- "http://127.0.0.1:8000/docs"

These checks apply only if the corresponding routes exist. A successful health check proves that the server responds; it does not prove that the database or Gemini integration works.

7. Common errors and how to resolve them

A. "ModuleNotFoundError"

Likely cause: a dependency is missing, or Python cannot resolve an import.

Action:

1. Activate the correct virtual environment.
2. Install "backend/requirements.txt".
3. Run commands from the repository root.
4. Check that imported modules and filenames exist.
5. Use consistent imports, such as "from backend.database import Base".

Do not rename files or change import paths randomly to suppress the error.

B. "No module named psycopg"

Likely cause: the PostgreSQL Python driver is missing from the active environment.

Action:

python -m pip install "psycopg[binary]"

Then retry the original command using the same Python environment.

C. "password authentication failed"

Likely cause: the PostgreSQL username or password is incorrect.

Action:

1. Check "DB_USER" and "DB_PASSWORD" in "backend/.env".
2. Test those credentials in pgAdmin or another PostgreSQL client.
3. Check whether the local PostgreSQL account uses a different password.
4. Restart the backend after correcting the settings.

Never paste database passwords into GitHub issues or public chat.

D. "database "ai_mech_lab" does not exist"

Likely cause: the database has not been created or "DB_NAME" is incorrect.

Action: create the database in PostgreSQL or correct "DB_NAME". Creating a database and creating its tables are separate operations.

E. "Connection refused" or connection timeout

Likely cause: PostgreSQL is stopped, the host or port is wrong, or network access is blocked.

Action:

1. Confirm PostgreSQL is running.
2. Check "DB_HOST" and "DB_PORT".
3. Verify the server accepts connections from the machine running the backend.
4. Retry the connection.

Do not change firewall or remote database settings without authorization.

F. Missing environment-variable error

Likely cause: ".env" is missing, incorrectly named, or has incomplete settings.

Action:

1. Confirm the file is named ".env", not ".env.txt".
2. Place it in "backend/".
3. Check the required variable names.
4. Check that the correct working environment is being used.

Do not print the actual secret values while debugging.

G. The script runs, but tables are missing

Likely cause: the models were not imported, the wrong database was selected, or table creation was never executed.

Action:

1. Inspect "Base.metadata.tables".
2. Confirm "database_models.py" is imported before "create_all()".
3. Check the database name and schema in pgAdmin.
4. Confirm the script actually executed.
5. Review the output for errors.

H. "GEMINI_API_KEY is missing"

Likely cause: the key is absent from the backend environment.

Action:

1. Confirm "GEMINI_API_KEY" is set in "backend/.env".
2. Check that "gemini_service.py" loads that file.
3. Restart the backend process.
4. Never hardcode the key into Python source code.

I. Gemini authentication, quota, or model errors

Likely cause: an invalid or restricted API key, exhausted quota, unavailable model, or API configuration issue.

Action:

1. Check the key through the authorized Google AI account.
2. Confirm the configured model is available to that account.
3. Review the error category and applicable quota limits.
4. Avoid repeated automatic retries for authentication or quota errors.
5. Never log or share the API key.

J. The Gemini parser rejects a pathway

Likely cause: the generated response does not follow the expected numbered-step structure or required fields.

Action:

1. Record the response type and parser error.
2. Compare the output with the relevant instruction in "gemini_notes.txt".
3. Check step numbering, step names, "Type", labels, video-search phrases, and video lengths.
4. Adjust the relevant prompt or parsing logic only after identifying the mismatch.
5. Add a test for the failure case.

Do not save a response as a valid pathway when parsing or validation fails.

K. Tables do not reflect updated model definitions

Likely cause: "create_all()" does not migrate existing tables.

Action: inspect the current schema and create a reviewed Alembic migration. Back up important data before applying schema changes.

8. How to complete unfinished code safely

When a required feature does not work:

1. Identify the failure. Record the command, endpoint, error message, and expected behavior.
2. Find the responsible file. Check the existing implementation before creating a duplicate.
3. Trace dependencies. Confirm the relevant models, repositories, configuration, and imports.
4. Implement the smallest necessary change. Avoid rewriting unrelated modules.
5. Test the change. Use a local database and safe test credentials.
6. Check failure handling. Database writes should roll back when appropriate; failed Gemini responses should not be stored as valid results.
7. Review security. Keep credentials out of source code and logs.
8. Commit on "backend-foundation". Use a clear commit message and report what changed.

If the intended behavior is unclear, ask the project owner before changing the data model or API contract.

9. Minimum integration checks

Before reporting the backend as ready, verify each item separately:

- [ ] Python dependencies install successfully.
- [ ] FastAPI starts without import errors.
- [ ] The health endpoint responds, if implemented.
- [ ] PostgreSQL connection succeeds.
- [ ] Expected tables exist in the correct database.
- [ ] A test pathway can be saved and retrieved.
- [ ] A test lesson can be saved and retrieved.
- [ ] Video-cache lookups use the expected cache key.
- [ ] Gemini can generate a response using a valid, authorized key.
- [ ] The parser accepts a valid sample and rejects an invalid sample.
- [ ] Cached responses are reused where the implemented integration supports it.
- [ ] No secrets or local environment files are committed.

These are verification tasks, not claims that the checks have already passed.

10. Responsibility boundaries

Database and Gemini integration: database configuration, model/table setup, repository behavior, Gemini response generation, response parsing, and related caching logic.

Other backend API work: authentication, user accounts, courses, progress, community features, and other API endpoints assigned to the backend API developer.

Coordinate changes that affect shared models, endpoint contracts, or imports before merging them.

11. What to report if the problem remains unresolved

Send the following information to the team:

- Exact command or endpoint used.
- Full error message with secrets removed.
- File and line where the error occurs.
- Expected behavior versus actual behavior.
- Steps already attempted.
- Whether the database, server, or Gemini request worked independently.

Do not claim the backend is complete until the relevant tests have actually passed.
