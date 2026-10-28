AI Mech Lab — Setup and Troubleshooting Guide

1. Purpose

This guide explains how to configure the backend, connect PostgreSQL, create the database tables, and troubleshoot common errors.

The current implementation is a foundation and has not yet been verified through a complete integration test.

2. Required files

File| Purpose
"database.py"| Connects Python to PostgreSQL
"database_models.py"| Defines the database tables
"create_tables.py"| Creates missing tables
"pathway_repository.py"| Saves and retrieves pathways
"lesson_repository.py"| Saves and retrieves lessons
"video_repository.py"| Saves and retrieves cached videos
"gemini_service.py"| Generates responses using Gemini
"gemini_response_parser.py"| Parses and validates Gemini responses
"main.py"| Starts the FastAPI application
"requirements.txt"| Lists Python dependencies
".env.example"| Documents required environment variables

Some files, including "database.py" and "main.py", were initially created locally. Confirm that all required files have been included in the project before running it.

3. Initial setup

Step 1: Install dependencies

From the project root, run:

"python -m pip install -r backend/requirements.txt"

Use the project's intended Python environment.

Step 2: Configure environment variables

Copy "backend/.env.example" to "backend/.env".

Configure:

- "DB_HOST"
- "DB_PORT"
- "DB_NAME"
- "DB_USER"
- "DB_PASSWORD"
- "GEMINI_API_KEY"
- "GEMINI_MODEL"

The database variables are required for PostgreSQL access. Gemini credentials are required for Gemini generation, but not for creating the tables alone.

Never commit actual passwords or API keys.

Step 3: Create the PostgreSQL database

Start PostgreSQL and create a database named "ai_mech_lab" if it does not already exist.

Confirm that the configured database user has the necessary permissions.

Step 4: Create the tables

From the project root, run:

"python -m backend.create_tables"

If the imports and configuration are correct, the script should create missing tables defined by the SQLAlchemy models.

Step 5: Verify the tables

Open pgAdmin and navigate to:

"ai_mech_lab → Schemas → public → Tables"

Refresh the Tables folder.

Check that the expected tables exist and that their columns, foreign keys, and constraints match "database_models.py".

4. Common errors and how to fix them

Error A: "ModuleNotFoundError"

Meaning: Python cannot find a required package or module.

Try this:

1. Confirm that the terminal is in the project root.
2. Confirm that the "backend" folder and required Python files exist.
3. Install dependencies using the command in Section 3.
4. Run the table creation command from the project root.

Do not rename imports or move files randomly to make the error disappear.

Error B: "ModuleNotFoundError: No module named 'psycopg'"

Meaning: The PostgreSQL Python driver is missing from the active environment.

Try this:

"python -m pip install "psycopg[binary]""

Then retry the database connection.

Error C: "password authentication failed"

Meaning: PostgreSQL rejected the username or password.

Try this:

1. Check "DB_USER" and "DB_PASSWORD" in the local ".env".
2. Confirm that the credentials work in pgAdmin or another PostgreSQL client.
3. Check that "DB_HOST" and "DB_PORT" point to the intended server.

Do not paste passwords into error reports or public chats.

Error D: "database "ai_mech_lab" does not exist"

Meaning: The PostgreSQL server is reachable, but the specified database has not been created.

Try this:

1. Open pgAdmin.
2. Connect to the correct PostgreSQL server.
3. Create the database "ai_mech_lab".
4. Confirm that "DB_NAME=ai_mech_lab" is set locally.

Creating the database and creating its tables are two separate operations.

Error E: "connection refused" or a connection timeout

Meaning: Python cannot establish a connection to the configured PostgreSQL server.

Try this:

1. Confirm that PostgreSQL is running.
2. Check the host and port.
3. Confirm that the server accepts connections from the machine running Python.
4. If PostgreSQL is hosted remotely, check network access and firewall rules.

Error F: Missing database environment variables

Meaning: The application could not load the required database configuration.

Try this:

1. Confirm that "backend/.env" exists.
2. Check that the variable names match those expected by "database.py".
3. Check that the values are not empty.
4. Restart the application after correcting the configuration.

Keep ".env" local and private.

Error G: The script reports success, but tables are missing

Meaning: The expected models may not have been registered, the wrong database may have been selected, or the table names may differ from expectations.

Try this:

1. Confirm that "create_tables.py" imports "database_models".
2. Confirm that the models inherit from the same "Base" object used by the engine.
3. Check which database is configured in ".env".
4. Refresh the correct database's Tables folder in pgAdmin.
5. Inspect "database_models.py" for the actual table names.

Error H: "GEMINI_API_KEY" is missing

Meaning: The Gemini service cannot find its API key.

Try this:

1. Confirm that "backend/.env" contains "GEMINI_API_KEY".
2. Confirm that the service loads the correct ".env" path.
3. Confirm that the key is valid.
4. Restart the Python process after updating the environment.

A missing Gemini key should not prevent PostgreSQL tables from being created.

Error I: Gemini returns an authentication, quota, or model error

Meaning: The request may have invalid credentials, insufficient quota, or an unavailable model.

Try this:

1. Check the API key and its access.
2. Check the project's current quota and usage limits.
3. Confirm that the configured model is available to the account.
4. Check the full error message before changing the model.

Do not automatically switch models without confirming the team's decision and cost implications.

Error J: The parser reports an invalid pathway

Meaning: Gemini returned content that did not satisfy the parser's structural validation.

Try this:

1. Inspect the parser's reported validation errors.
2. Compare the raw response with the appropriate Gemini instruction note.
3. Confirm that step numbering, labels, types, and video lengths follow the required format.
4. Do not save the response as a valid pathway while validation fails.

A retry or regeneration strategy may be added later, but should be implemented deliberately to avoid unnecessary API usage.

Error K: "create_all()" does not update an existing table

Meaning: SQLAlchemy's "create_all()" creates missing tables; it is not a general schema migration system.

Try this:

1. Inspect the existing table structure.
2. Compare it with the current models.
3. Use an Alembic migration to apply approved schema changes.

Do not drop tables or delete existing records merely to make the schema match.

5. Important limitations

- Successful table creation does not prove that the complete backend works.
- Repository operations must be tested separately.
- Gemini generation and response parsing must be tested separately.
- API endpoints must be tested after they are implemented.
- Shared database model changes must be coordinated with the backend team.

6. Security requirements

- Never commit ".env" or real API keys.
- Never paste database passwords into public error reports.
- Use appropriately restricted database credentials.
- Keep Gemini credentials in environment variables.
- Rotate any credential that has been exposed.

7. Reporting an unresolved error

If an error persists, report:

1. The exact command that was run.
2. The complete error message, with secrets removed.
3. The Python version.
4. Whether PostgreSQL is running.
5. Whether the database exists.
6. Which step failed.

This information helps the team identify the problem without repeatedly guessing.
