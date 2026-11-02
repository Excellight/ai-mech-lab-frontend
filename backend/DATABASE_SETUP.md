AI Mech Lab — Database Setup Guide

1. Purpose

This guide explains how to configure PostgreSQL and create the initial AI Mech Lab database tables.

The database stores generated learning pathways, their steps, generated lessons, and cached video search results.

2. Requirements

Install or prepare the following:

- Python 3.11 or a compatible version.
- PostgreSQL.
- Git.
- The project dependencies listed in "backend/requirements.txt".

The following files are used for database setup:

- "backend/database.py" — database connection.
- "backend/database_models.py" — table definitions.
- "backend/create_tables.py" — table creation script.
- "backend/.env.example" — environment configuration template.

3. Create the PostgreSQL database

Start PostgreSQL and open pgAdmin or another PostgreSQL client.

Create a database named:

"ai_mech_lab"

Use a PostgreSQL account that has permission to create tables in this database.

4. Configure environment variables

Copy "backend/.env.example" to "backend/.env".

Fill in the correct PostgreSQL username and password. The host and port should match the local or remote PostgreSQL server.

The Gemini API key is needed for Gemini generation, but it is not required merely to create the database tables.

Do not commit "backend/.env" to GitHub.

5. Install dependencies

Open a terminal in the project root and run:

"python -m pip install -r backend/requirements.txt"

Make sure the terminal is using the intended Python environment.

6. Create the tables

From the project root, run:

"python -m backend.create_tables"

The script should create any missing tables defined by the SQLAlchemy models and display their registered names.

If an error occurs, check the PostgreSQL service, database name, credentials, installed dependencies, and Python imports.

7. Verify the tables

Open pgAdmin and navigate to:

"ai_mech_lab → Schemas → public → Tables"

Refresh the Tables folder.

Inspect the created tables and confirm that their columns, foreign keys, and constraints match "backend/database_models.py".

The expected core tables are:

- "generated_pathways"
- "pathway_steps"
- "generated_lessons"
- "video_cache"

Confirm the actual table names in the models if they differ.

8. Important limitations

Successful execution of the script does not prove that the complete application works.

The database connection, saving and retrieving records, Gemini integration, and API endpoints must be tested separately.

"create_all()" creates missing tables but does not automatically update existing tables when models change. Use Alembic migrations for future schema changes.

Coordinate changes to shared models with the backend team before creating migrations.

9. Security

- Never commit real passwords or API keys.
- Use separate database credentials for development where practical.
- Do not expose PostgreSQL publicly without appropriate network and access controls.
- Keep database setup separate from authentication, progress, course, and community API implementation.
