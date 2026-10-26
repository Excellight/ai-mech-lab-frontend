import os
import re
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


# --------------------------------------------------
# 1. Load backend environment variables
# --------------------------------------------------

BACKEND_DIR = Path(__file__).resolve().parent

load_dotenv(BACKEND_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash",
)

NOTES_FILE = BACKEND_DIR / "gemini_notes.txt"
SITE_FACTS_FILE = BACKEND_DIR / "site_facts.txt"


# --------------------------------------------------
# 2. Identify the six Gemini instructions
# --------------------------------------------------

NOTE_HEADINGS = {
    1: "PROJECT LEARNING TRACK",
    2: "BUILD CHECKLIST",
    3: "SUBJECT TRACK",
    4: "LESSON NOTE",
    5: "CHATBOT",
    6: "EDIT-TRACK NOTE",
}


# Notes that require a low temperature.
LOW_TEMPERATURE_NOTES = {1, 2, 3, 6}


# --------------------------------------------------
# 3. Load an instruction note from the text file
# --------------------------------------------------

def load_gemini_note(note_number: int) -> str:
    """Load the requested Gemini instruction without
    rewriting its original wording."""

    if note_number not in NOTE_HEADINGS:
        raise ValueError(
            "Note number must be between 1 and 6."
        )

    if not NOTES_FILE.exists():
        raise FileNotFoundError(
            "The Gemini notes file was not found."
        )

    notes_text = NOTES_FILE.read_text(
        encoding="utf-8"
    )

    heading_pattern = re.compile(
        rf"^NOTE {note_number} - .*?$",
        re.MULTILINE,
    )

    match = heading_pattern.search(notes_text)

    if not match:
        raise ValueError(
            f"Gemini Note {note_number} was not found."
        )

    next_heading_pattern = re.compile(
        r"^NOTE \d+ - .*?$",
        re.MULTILINE,
    )

    next_match = next_heading_pattern.search(
        notes_text,
        match.end(),
    )

    if next_match:
        note_text = notes_text[
            match.start():next_match.start()
        ]
    else:
        note_text = notes_text[match.start():]

    return note_text.strip()


# --------------------------------------------------
# 4. Load the separate chatbot site facts
# --------------------------------------------------

def load_site_facts() -> str:
    """Read the latest site facts from their own file."""

    if not SITE_FACTS_FILE.exists():
        raise FileNotFoundError(
            "The site facts file was not found."
        )

    return SITE_FACTS_FILE.read_text(
        encoding="utf-8"
    ).strip()


# --------------------------------------------------
# 5. Prepare the system instruction
# --------------------------------------------------

def prepare_system_instruction(
    note_number: int,
) -> str:
    """Prepare the selected instruction for Gemini."""

    note = load_gemini_note(note_number)

    if note_number == 5:
        site_facts = load_site_facts()

        pattern = re.compile(
            r"SITE FACTS "
            r"\(the only source for questions about the site\):"
            r"\n.*?\nRules:",
            re.DOTALL,
        )

        replacement = (
            "SITE FACTS "
            "(the only source for questions about the site):"
            "\n"
            + site_facts
            + "\n\nRules:"
        )

        note, replacements = pattern.subn(
            replacement,
            note,
            count=1,
        )

        if replacements != 1:
            raise ValueError(
                "Could not locate the SITE FACTS "
                "section in Gemini Note 5."
            )

    return note


# --------------------------------------------------
# 6. Send a request to Gemini
# --------------------------------------------------

def generate_gemini_response(
    note_number: int,
    user_message: str,
) -> str:
    """Send a user message with the correct Gemini note."""

    if not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is missing from "
            "the backend environment."
        )

    if not user_message.strip():
        raise ValueError(
            "The user message cannot be empty."
        )

    system_instruction = prepare_system_instruction(
        note_number
    )

    temperature = (
        0.2
        if note_number in LOW_TEMPERATURE_NOTES
        else 0.7
    )

    client = genai.Client(
        api_key=GEMINI_API_KEY
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
        ),
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    return response.text.strip()
