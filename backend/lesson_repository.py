from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.database_models import GeneratedLesson

--------------------------------------------------

1. Save a generated lesson

--------------------------------------------------

def save_lesson(
db: Session,
step_id: int,
lesson_type: str,
label: str,
content: str,
) -> GeneratedLesson:
"""Save a generated lesson for a pathway step."""

lesson = GeneratedLesson(
    step_id=step_id,
    lesson_type=lesson_type,
    label=label,
    content=content,
)

try:
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

except Exception:
    db.rollback()
    raise

--------------------------------------------------

2. Retrieve a lesson by its ID

--------------------------------------------------

def get_lesson_by_id(
db: Session,
lesson_id: int,
) -> GeneratedLesson | None:
"""Retrieve a saved lesson by its database ID."""

statement = select(GeneratedLesson).where(
    GeneratedLesson.id == lesson_id
)

return db.scalars(statement).first()

--------------------------------------------------

3. Find an existing lesson for a step

--------------------------------------------------

def find_cached_lesson(
db: Session,
step_id: int,
lesson_type: str,
label: str,
) -> GeneratedLesson | None:
"""Look for an existing lesson matching the request."""

statement = (
    select(GeneratedLesson)
    .where(
        GeneratedLesson.step_id == step_id,
        GeneratedLesson.lesson_type == lesson_type,
        GeneratedLesson.label == label,
    )
    .order_by(GeneratedLesson.created_at.desc())
)

return db.scalars(statement).first()

--------------------------------------------------

4. Retrieve all lessons for a step

--------------------------------------------------

def get_lessons_for_step(
db: Session,
step_id: int,
) -> list[GeneratedLesson]:
"""Return all saved lessons for a pathway step."""

statement = (
    select(GeneratedLesson)
    .where(GeneratedLesson.step_id == step_id)
    .order_by(GeneratedLesson.created_at.desc())
)

return list(db.scalars(statement).all())
