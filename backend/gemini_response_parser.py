import re
from typing import Any


PATHWAY_RESPONSE_TYPES = {
    "learning_track",
    "build_checklist",
    "subject_track",
    "edit_track",
}

LABELLED_RESPONSE_TYPES = {
    "learning_track",
    "subject_track",
    "edit_track",
}

SPECIAL_RESPONSES = {
    "NOT_AVAILABLE": {
        "status": "not_available",
        "message": (
            "This topic is not currently supported "
            "by AI Mech Lab."
        ),
    },
    "NOT_AN_EDIT": {
        "status": "not_an_edit",
        "message": (
            "Please provide a request to change "
            "your learning track."
        ),
    },
}


def parse_special_response(
    response: str,
) -> dict[str, Any]:
    """Identify special responses returned by Gemini."""

    cleaned_response = response.strip()

    if cleaned_response in SPECIAL_RESPONSES:
        return SPECIAL_RESPONSES[cleaned_response].copy()

    return {
        "status": "success",
        "response": cleaned_response,
    }


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


def parse_pathway_steps(
    response: str,
) -> list[dict[str, Any]]:
    """Extract numbered steps and their labelled details."""

    steps = []
    current_step = None

    step_pattern = re.compile(
        r"^\s*(?:Step\s*)?(\d+)[.)]\s*(.+?)\s*$",
        re.IGNORECASE,
    )

    for raw_line in response.splitlines():
        line = raw_line.strip()

        if not line:
            continue

        match = step_pattern.match(line)

        if match:
            if current_step is not None:
                steps.append(current_step)

            step_text = match.group(2).strip()
            label = None

            label_match = re.match(
                r"^\[(Learn|Refresher)\]\s*(.+)$",
                step_text,
                re.IGNORECASE,
            )

            if label_match:
                label = label_match.group(1).title()
                step_text = label_match.group(2).strip()

            current_step = {
                "step_number": int(match.group(1)),
                "name": step_text,
                "label": label,
                "type": None,
                "video_search_phrase": None,
                "video_length": None,
            }

            continue

        if current_step is None:
            continue

        for field, label_name in (
            ("label", "Label"),
            ("type", "Type"),
            ("video_search_phrase", "Video search"),
            ("video_length", "Video length"),
        ):
            value = extract_labelled_value(
                line,
                label_name,
            )

            if value is not None:
                current_step[field] = value

    if current_step is not None:
        steps.append(current_step)

    return steps


def validate_pathway_steps(
    steps: list[dict[str, Any]],
    response_type: str,
) -> list[str]:
    """Validate pathway structure against the Gemini notes."""

    errors = []

    if not steps:
        return ["The response contains no numbered pathway steps."]

    expected_label = response_type in LABELLED_RESPONSE_TYPES

    for index, step in enumerate(steps, start=1):
        number = step["step_number"]
        name = step["name"]
        step_type = step["type"]
        label = step["label"]
        video_phrase = step["video_search_phrase"]
        video_length = step["video_length"]

        if number != index:
            errors.append(
                f"Expected step number {index}, got {number}."
            )

        if not name:
            errors.append(f"Step {number} has no name.")
        elif len(name.split()) > 6:
            errors.append(
                f"Step {number} has more than six words."
            )

        if step_type not in {"Video", "Manual"}:
            errors.append(
                f"Step {number} must have Type: Video or Manual."
            )
            continue

        if expected_label and label not in {
            "Learn",
            "Refresher",
        }:
            errors.append(
                f"Step {number} needs a Learn or Refresher label."
            )

        if not expected_label and label is not None:
            errors.append(
                f"Step {number} must not have a label."
            )

        if step_type == "Manual":
            if video_phrase is not None or video_length is not None:
                errors.append(
                    f"Manual step {number} must not have video fields."
                )

            continue

        if not video_phrase:
            errors.append(
                f"Video step {number} needs a video search phrase."
            )

        if video_length not in {"medium", "long"}:
            errors.append(
                f"Video step {number} needs a valid video length."
            )

        if response_type == "build_checklist":
            if video_length != "medium":
                errors.append(
                    f"Build checklist video step {number} "
                    "must use medium length."
                )

        elif label == "Learn" and video_length != "long":
            errors.append(
                f"Learn step {number} must use long video length."
            )

        elif label == "Refresher" and video_length != "medium":
            errors.append(
                f"Refresher step {number} must use medium video length."
            )

    return errors


def parse_gemini_response(
    response: str,
    response_type: str = "general",
) -> dict[str, Any]:
    """Convert Gemini text into a structured result."""

    if not response or not response.strip():
        return {
            "status": "error",
            "message": "Gemini returned an empty response.",
        }

    special_result = parse_special_response(response)

    if special_result["status"] != "success":
        return special_result

    cleaned_response = response.strip()

    if response_type in PATHWAY_RESPONSE_TYPES:
        steps = parse_pathway_steps(cleaned_response)

        errors = validate_pathway_steps(
            steps,
            response_type,
        )

        note = extract_labelled_value(
            cleaned_response,
            "Note",
        )

        if errors:
            return {
                "status": "error",
                "message": "Gemini returned an invalid pathway.",
                "errors": errors,
                "raw_response": cleaned_response,
            }

        result = {
            "status": "success",
            "response_type": response_type,
            "steps": steps,
            "raw_response": cleaned_response,
        }

        if note is not None:
            result["note"] = note

        return result

    return {
        "status": "success",
        "response_type": response_type,
        "response": cleaned_response,
    }
