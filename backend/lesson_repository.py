
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.database_models import GeneratedLesson


def save_lesson(
    db: Session,
    step_id: int,
    lesson_type: str,
    label: str,
    content: str,
    *,
    generation_fingerprint: str,
) -> GeneratedLesson:
    if step_id <= 0:
        raise ValueError("Step ID must be a positive integer.")

    if not lesson_type.strip():
        raise ValueError("Lesson type cannot be empty.")

    if not label.strip():
        raise ValueError("Lesson label cannot be empty.")

    if not content.strip():
        raise ValueError("Lesson content cannot be empty.")

    lesson = GeneratedLesson(
        step_id=step_id,
        lesson_type=lesson_type.strip(),
        label=label.strip(),
        content=content.strip(),
        generation_fingerprint=generation_fingerprint,
    )

    try:
        db.add(lesson)
        db.commit()
        db.refresh(lesson)
        return lesson
    except Exception:
        db.rollback()
        raise


def get_lesson_by_id(
    db: Session,
    lesson_id: int,
) -> GeneratedLesson | None:
    statement = select(GeneratedLesson).where(
        GeneratedLesson.id == lesson_id
    )
    return db.scalars(statement).first()


def find_cached_lesson(
    db: Session,
    step_id: int,
    lesson_type: str,
    label: str,
    *,
    generation_fingerprint: str,
) -> GeneratedLesson | None:
    statement = (
        select(GeneratedLesson)
        .where(
            GeneratedLesson.step_id == step_id,
            GeneratedLesson.lesson_type == lesson_type,
            GeneratedLesson.label == label,
            GeneratedLesson.generation_fingerprint
            == generation_fingerprint,
        )
        .order_by(GeneratedLesson.created_at.desc())
    )
    return db.scalars(statement).first()


def get_lessons_for_step(
    db: Session,
    step_id: int,
) -> list[GeneratedLesson]:
    statement = (
        select(GeneratedLesson)
        .where(GeneratedLesson.step_id == step_id)
        .order_by(GeneratedLesson.created_at.desc())
    )
    return list(db.scalars(statement).all())
