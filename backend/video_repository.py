
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.database_models import VideoCache


def normalize_search_phrase(search_phrase: str) -> str:
    if not search_phrase or not search_phrase.strip():
        raise ValueError("Search phrase cannot be empty.")

    return " ".join(search_phrase.split()).casefold()


def find_cached_video(
    db: Session,
    search_phrase: str,
    requested_length: str = "medium",
) -> VideoCache | None:
    normalized_phrase = normalize_search_phrase(search_phrase)
    normalized_length = requested_length.strip().casefold()

    if normalized_length not in {"medium", "long"}:
        raise ValueError("Requested length must be 'medium' or 'long'.")

    statement = select(VideoCache).where(
        VideoCache.search_phrase == normalized_phrase,
        VideoCache.requested_length == normalized_length,
    )

    return db.scalars(statement).first()


def save_cached_video(
    db: Session,
    search_phrase: str,
    video_id: str,
    video_title: str,
    video_url: str,
    requested_length: str = "medium",
    duration_seconds: int | None = None,
    is_embeddable: bool = True,
) -> VideoCache:
    normalized_phrase = normalize_search_phrase(search_phrase)
    normalized_length = requested_length.strip().casefold()

    if normalized_length not in {"medium", "long"}:
        raise ValueError("Requested length must be 'medium' or 'long'.")

    if not video_id or not video_id.strip():
        raise ValueError("Video ID cannot be empty.")

    if not video_title or not video_title.strip():
        raise ValueError("Video title cannot be empty.")

    if not video_url or not video_url.strip():
        raise ValueError("Video URL cannot be empty.")

    if duration_seconds is not None and duration_seconds < 0:
        raise ValueError("Duration cannot be negative.")

    existing_video = find_cached_video(
        db,
        normalized_phrase,
        normalized_length,
    )

    if existing_video is not None:
        return existing_video

    video = VideoCache(
        search_phrase=normalized_phrase,
        requested_length=normalized_length,
        video_id=video_id.strip(),
        video_title=video_title.strip(),
        video_url=video_url.strip(),
        duration_seconds=duration_seconds,
        is_embeddable=is_embeddable,
    )

    try:
        db.add(video)
        db.commit()
        db.refresh(video)
        return video
    except Exception:
        db.rollback()
        raise
