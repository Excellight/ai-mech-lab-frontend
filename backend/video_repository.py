from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.database_models import VideoCache

--------------------------------------------------

1. Find a cached video by its search phrase

--------------------------------------------------

def find_cached_video(
db: Session,
search_phrase: str,
) -> VideoCache | None:
"""Return a previously saved video for this phrase."""

normalized_phrase = search_phrase.strip().casefold()

if not normalized_phrase:
    return None

statement = select(VideoCache).where(
    VideoCache.search_phrase == normalized_phrase
)

return db.scalars(statement).first()

--------------------------------------------------

2. Save a YouTube search result

--------------------------------------------------

def save_cached_video(
db: Session,
search_phrase: str,
video_id: str,
video_title: str,
video_url: str,
duration_seconds: int | None = None,
is_embeddable: bool = True,
) -> VideoCache:
"""Save a YouTube result for reuse."""

normalized_phrase = search_phrase.strip().casefold()

if not normalized_phrase:
    raise ValueError("Search phrase cannot be empty.")

if not video_id.strip():
    raise ValueError("Video ID cannot be empty.")

existing_video = find_cached_video(
    db,
    normalized_phrase,
)

if existing_video is not None:
    return existing_video

video = VideoCache(
    search_phrase=normalized_phrase,
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
