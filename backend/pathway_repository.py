import re

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.database_models import GeneratedPathway, PathwayStep


def normalize_goal(goal: str) -> str:
    """Normalize a learning goal for consistent cache lookups."""
    return re.sub(r"\s+", " ", goal.strip().casefold())


def save_pathway(
    db: Session,
    goal: str,
    pathway_type: str,
    generated_response: str,
    steps: list[dict],
    user_id: str | None = None,
    already_known: list | None = None,
    note_version: str = "1",
) -> GeneratedPathway:
    """Save a generated learning pathway and its steps."""

    normalized_goal = normalize_goal(goal)

    if not normalized_goal:
        raise ValueError("Learning goal cannot be empty.")

    if not pathway_type.strip():
        raise ValueError("Pathway type cannot be empty.")

    if not generated_response.strip():
        raise ValueError("Generated response cannot be empty.")

    pathway = GeneratedPathway(
        user_id=user_id,
        goal=goal.strip(),
        normalized_goal=normalized_goal,
        pathway_type=pathway_type.strip(),
        already_known=already_known,
        generated_response=generated_response.strip(),
        note_version=note_version,
    )

    for step_data in steps:
        pathway.steps.append(
            PathwayStep(
                step_number=step_data["step_number"],
                name=step_data["name"],
                label=step_data.get("label"),
                step_type=step_data.get("type"),
                video_search_phrase=step_data.get(
                    "video_search_phrase"
                ),
                video_length=step_data.get("video_length"),
            )
        )

    try:
        db.add(pathway)
        db.commit()
        db.refresh(pathway)
        return pathway
    except Exception:
        db.rollback()
        raise


def get_pathway_by_id(
    db: Session,
    pathway_id: int,
) -> GeneratedPathway | None:
    """Retrieve a pathway and its steps by ID."""

    statement = (
        select(GeneratedPathway)
        .where(GeneratedPathway.id == pathway_id)
        .options(selectinload(GeneratedPathway.steps))
    )

    return db.scalars(statement).first()


def find_cached_pathway(
    db: Session,
    goal: str,
    pathway_type: str,
    user_id: str | None = None,
    already_known: list | None = None,
    note_version: str = "1",
) -> GeneratedPathway | None:
    """Find a matching pathway generated under the same instructions."""

    normalized_goal = normalize_goal(goal)

    if not normalized_goal:
        return None

    statement = select(GeneratedPathway).where(
        GeneratedPathway.normalized_goal == normalized_goal,
        GeneratedPathway.pathway_type == pathway_type.strip(),
        GeneratedPathway.note_version == note_version,
    )

    if user_id is None:
        statement = statement.where(
            GeneratedPathway.user_id.is_(None)
        )
    else:
        statement = statement.where(
            GeneratedPathway.user_id == user_id
        )

    statement = statement.options(
        selectinload(GeneratedPathway.steps)
    )

    candidates = db.scalars(statement).all()

    for pathway in candidates:
        if pathway.already_known == already_known:
            return pathway

    return None
