from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.database_models import GeneratedPathway, PathwayStep

--------------------------------------------------

1. Save a generated pathway and its steps

--------------------------------------------------

def save_pathway(
db: Session,
goal: str,
pathway_type: str,
generated_response: str,
steps: list[dict],
user_id: str | None = None,
already_known: list | None = None,
) -> GeneratedPathway:
"""
Save a generated pathway and its steps.

The caller should check the cache before creating
a new pathway.
"""

pathway = GeneratedPathway(
    user_id=user_id,
    goal=goal,
    pathway_type=pathway_type,
    already_known=already_known,
    generated_response=generated_response,
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

--------------------------------------------------

2. Retrieve a pathway by its database ID

--------------------------------------------------

def get_pathway_by_id(
db: Session,
pathway_id: int,
) -> GeneratedPathway | None:
"""Retrieve a pathway and its steps."""

statement = (
    select(GeneratedPathway)
    .where(GeneratedPathway.id == pathway_id)
    .options(
        selectinload(GeneratedPathway.steps)
    )
)

return db.scalars(statement).first()

--------------------------------------------------

3. Find an existing pathway for a goal

--------------------------------------------------

def find_cached_pathway(
db: Session,
goal: str,
pathway_type: str,
user_id: str | None = None,
already_known: list | None = None,
) -> GeneratedPathway | None:
"""
Find an existing pathway matching the request.

This is a basic cache lookup. We will refine the
matching rules after testing the actual requirements.
"""

statement = select(GeneratedPathway).where(
    GeneratedPathway.goal == goal,
    GeneratedPathway.pathway_type == pathway_type,
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
