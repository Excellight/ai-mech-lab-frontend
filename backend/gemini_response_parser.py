import re
from typing import Any

--------------------------------------------------

1. Handle special Gemini responses

--------------------------------------------------

def parse_special_response(response: str) -> dict[str, Any]:
"""Identify special responses returned by Gemini."""

cleaned_response = response.strip()

if cleaned_response == "NOT_AVAILABLE":
    return {
        "status": "not_available",
        "message": (
            "This topic is not currently supported "
            "by AI Mech Lab."
        ),
    }

if cleaned_response == "NOT_AN_EDIT":
    return {
        "status": "not_an_edit",
        "message": (
            "Please provide a request to change "
            "your learning track."
        ),
    }

return {
    "status": "success",
    "response": cleaned_response,
}

--------------------------------------------------

2. Extract labelled sections

--------------------------------------------------

def extract_labelled_value(
text: str,
label: str,
) -> str | None:
"""Extract a value introduced by a label."""

pattern = re.compile(
    rf"^{re.escape(label)}\s*:\s*(.*?)\s*$",
    re.IGNORECASE | re.MULTILINE,
)

match = pattern.search(text)

if match:
    return match.group(1).strip()

return None

--------------------------------------------------

3. Extract numbered pathway steps

--------------------------------------------------

def parse_pathway_steps(response: str) -> list[dict[str, Any]]:
"""Extract numbered steps and their labelled details."""

steps = []
current_step = None

step_pattern = re.compile(
    r"^\s*(?:Step\s*)?(\d+)[.)]\s*(.+?)\s*$",
    re.IGNORECASE,
)

for line in response.splitlines():
    line = line.strip()

    if not line:
        continue

    match = step_pattern.match(line)

    if match:
        if current_step is not None:
            steps.append(current_step)

        current_step = {
            "step_number": int(match.group(1)),
            "name": match.group(2).strip(),
            "label": None,
            "type": None,
            "video_search_phrase": None,
            "video_length": None,
        }

        continue

    if current_step is None:
        continue

    label = extract_labelled_value(line, "Label")
    step_type = extract_labelled_value(line, "Type")
    video_phrase = extract_labelled_value(
        line,
        "Video search phrase",
    )
    video_length = extract_labelled_value(
        line,
        "Video length",
    )

    if label is not None:
        current_step["label"] = label

    if step_type is not None:
        current_step["type"] = step_type

    if video_phrase is not None:
        current_step["video_search_phrase"] = video_phrase

    if video_length is not None:
        current_step["video_length"] = video_length

if current_step is not None:
    steps.append(current_step)

return steps

--------------------------------------------------

4. Parse a complete Gemini response

--------------------------------------------------

def parse_gemini_response(
response: str,
response_type: str = "general",
) -> dict[str, Any]:
"""Convert Gemini's text into a structured result."""

if not response or not response.strip():
    return {
        "status": "error",
        "message": "Gemini returned an empty response.",
    }

special_result = parse_special_response(response)

if special_result["status"] != "success":
    return special_result

cleaned_response = response.strip()

if response_type in {
    "learning_track",
    "build_checklist",
    "subject_track",
    "edit_track",
}:
    steps = parse_pathway_steps(cleaned_response)

    return {
        "status": "success",
        "response_type": response_type,
        "steps": steps,
        "raw_response": cleaned_response,
    }

return {
    "status": "success",
    "response_type": response_type,
    "response": cleaned_response,
}
