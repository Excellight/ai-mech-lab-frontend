
import hashlib
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(BACKEND_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

NOTES_FILE = BACKEND_DIR / "gemini_notes.txt"
SITE_FACTS_FILE = BACKEND_DIR / "site_facts.txt"

NOTE_HEADINGS = {
    1: "PROJECT LEARNING TRACK",
    2: "BUILD CHECKLIST",
    3: "SUBJECT TRACK",
    4: "LESSON NOTE",
    5: "CHATBOT",
    6: "EDIT-TRACK NOTE",
}

LOW_TEMPERATURE_NOTES = {1, 2, 3, 6}


def load_gemini_note(note_number: int) -> str:
    if note_number not in NOTE_HEADINGS:
        raise ValueError("Note number must be between 1 and 6.")

    if not NOTES_FILE.exists():
        raise FileNotFoundError(
            "The Gemini notes file was not found."
        )

    notes_text = NOTES_FILE.read_text(encoding="utf-8")

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
        notes_text, match.end()
    )

    if next_match:
        note_text = notes_text[match.start():next_match.start()]
    else:
        note_text = notes_text[match.start():]

    return note_text.strip()


def load_site_facts() -> str:
    if not SITE_FACTS_FILE.exists():
        raise FileNotFoundError(
            "The site facts file was not found."
        )

    return SITE_FACTS_FILE.read_text(
        encoding="utf-8"
    ).strip()


def prepare_system_instruction(note_number: int) -> str:
    note = load_gemini_note(note_number)

    if note_number == 5:
        site_facts = load_site_facts()

        pattern = re.compile(
            r"SITE FACTS \(the only source for questions about the site\):\n.*?\nRules:",
            re.DOTALL,
        )

        replacement = (
            "SITE FACTS (the only source for questions about the site):"
            "\n" + site_facts + "\n\nRules:"
        )

        note, replacements = pattern.subn(
            replacement, note, count=1
        )

        if replacements != 1:
            raise ValueError(
                "Could not locate the SITE FACTS section "
                "in Gemini Note 5."
            )

    return note


def create_generation_fingerprint(
    system_instruction: str,
) -> str:
    fingerprint_input = (
        GEMINI_MODEL + "\0" + system_instruction
    )

    return hashlib.sha256(
        fingerprint_input.encode("utf-8")
    ).hexdigest()


def generate_gemini_response_with_fingerprint(
    note_number: int,
    user_message: str,
) -> tuple[str, str]:
    if not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is missing from the backend environment."
        )

    if not user_message or not user_message.strip():
        raise ValueError("The user message cannot be empty.")

    system_instruction = prepare_system_instruction(
        note_number
    )

    fingerprint = create_generation_fingerprint(
        system_instruction
    )

    temperature = (
        0.2 if note_number in LOW_TEMPERATURE_NOTES
        else 0.7
    )

    client = genai.Client(api_key=GEMINI_API_KEY)

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

    return response.text.strip(), fingerprint


def generate_gemini_response(
    note_number: int,
    user_message: str,
) -> str:
    response_text, _ = generate_gemini_response_with_fingerprint(
        note_number,
        user_message,
    )

    return response_text
