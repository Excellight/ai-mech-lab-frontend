from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


class GeneratedPathway(Base):
    __tablename__ = "generated_pathways"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    user_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, index=True
    )
    goal: Mapped[str] = mapped_column(
        String(500), nullable=False
    )
    normalized_goal: Mapped[str] = mapped_column(
        String(500), nullable=False, default="", index=True
    )
    pathway_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )
    already_known: Mapped[list | None] = mapped_column(
        JSON, nullable=True
    )
    generated_response: Mapped[str] = mapped_column(
        Text, nullable=False
    )
    generation_fingerprint: Mapped[str] = mapped_column(
    String(64), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    steps: Mapped[list["PathwayStep"]] = relationship(
        back_populates="pathway",
        cascade="all, delete-orphan",
        order_by="PathwayStep.step_number",
    )

    __table_args__ = (
        Index(
            "ix_pathway_cache_lookup",
            "normalized_goal",
            "pathway_type",
            "generation_fingerprint",
        ),
    )


class PathwayStep(Base):
    __tablename__ = "pathway_steps"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    pathway_id: Mapped[int] = mapped_column(
        ForeignKey("generated_pathways.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    step_number: Mapped[int] = mapped_column(
        Integer, nullable=False
    )
    name: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    label: Mapped[str | None] = mapped_column(
        String(50), nullable=True
    )
    step_type: Mapped[str | None] = mapped_column(
        String(50), nullable=True
    )
    video_search_phrase: Mapped[str | None] = mapped_column(
        String(500), nullable=True
    )
    video_length: Mapped[str | None] = mapped_column(
        String(50), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    pathway: Mapped["GeneratedPathway"] = relationship(
        back_populates="steps"
    )
    lessons: Mapped[list["GeneratedLesson"]] = relationship(
        back_populates="step",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "pathway_id",
            "step_number",
            name="uq_pathway_step_number",
        ),
    )


class GeneratedLesson(Base):
    __tablename__ = "generated_lessons"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    step_id: Mapped[int] = mapped_column(
        ForeignKey("pathway_steps.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    lesson_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )
    label: Mapped[str] = mapped_column(
        String(50), nullable=False
    )
    content: Mapped[str] = mapped_column(
        Text, nullable=False
    )
    generation_fingerprint: Mapped[str] = mapped_column(
    String(64), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    step: Mapped["PathwayStep"] = relationship(
        back_populates="lessons"
    )

    __table_args__ = (
        Index(
            "ix_lesson_cache_lookup",
            "step_id",
            "lesson_type",
            "label",
            "generation_fingerprint",
        ),
    )


class VideoCache(Base):
    __tablename__ = "video_cache"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True
    )
    search_phrase: Mapped[str] = mapped_column(
        String(500), nullable=False
    )
    requested_length: Mapped[str] = mapped_column(
        String(50), nullable=False, default="medium"
    )
    video_id: Mapped[str] = mapped_column(
        String(100), nullable=False
    )
    video_title: Mapped[str] = mapped_column(
        String(500), nullable=False
    )
    video_url: Mapped[str] = mapped_column(
        String(1000), nullable=False
    )
    duration_seconds: Mapped[int | None] = mapped_column(
        Integer, nullable=True
    )
    is_embeddable: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "search_phrase",
            "requested_length",
            name="uq_video_cache_phrase_length",
        ),
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    phone_or_email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    middle_name: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    country: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    city: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    field_of_study: Mapped[str] = mapped_column(String(150), default="Mechatronics", nullable=False)
    gender: Mapped[str] = mapped_column(String(50), default="Prefer not to say", nullable=False)
    dob: Mapped[str] = mapped_column(String(20), default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class UserStats(Base):
    __tablename__ = "user_stats"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    xp: Mapped[int] = mapped_column(Integer, default=1250, nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=7, nullable=False)
    labs_completed: Mapped[int] = mapped_column(Integer, default=18, nullable=False)
    quiz_score_avg: Mapped[int] = mapped_column(Integer, default=86, nullable=False)
    streak_days: Mapped[int] = mapped_column(Integer, default=6, nullable=False)
    daily_problems_solved: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    achievements_count: Mapped[int] = mapped_column(Integer, default=24, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class UserPreference(Base):
    __tablename__ = "user_preferences"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    theme_pref: Mapped[str] = mapped_column(String(20), default="system", nullable=False)
    text_size: Mapped[int] = mapped_column(Integer, default=16, nullable=False)
    reduce_motion: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    lesson_reminders: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sound_effects: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    selected_language: Mapped[str] = mapped_column(String(50), default="English", nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class UserTrackProgress(Base):
    __tablename__ = "user_track_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    track_key: Mapped[str] = mapped_column(String(100), nullable=False)
    completed_steps_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_step_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "track_key", name="uq_user_track_key"),
    )


class CheckpointAttempt(Base):
    __tablename__ = "checkpoint_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    topic_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    checkpoint_index: Mapped[int] = mapped_column(Integer, nullable=False)
    selected_option: Mapped[int] = mapped_column(Integer, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    deck_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    icon: Mapped[str] = mapped_column(String(10), default="🧪", nullable=False)
    bg: Mapped[str] = mapped_column(String(20), default="#DDF5E3", nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    category: Mapped[str] = mapped_column(String(100), default="Courses", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    user_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    author_name: Mapped[str] = mapped_column(String(150), nullable=False)
    author_initials: Mapped[str] = mapped_column(String(10), default="ML", nullable=False)
    author_role: Mapped[str] = mapped_column(String(100), default="Learner", nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    details: Mapped[str] = mapped_column(Text, default="", nullable=False)
    tags: Mapped[list | None] = mapped_column(JSON, nullable=True)
    upvotes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    replies_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class ThreadMessage(Base):
    __tablename__ = "thread_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    thread_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    sender_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    is_sender: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class CustomTrack(Base):
    __tablename__ = "custom_tracks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    track_key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    kind: Mapped[str] = mapped_column(String(50), default="course", nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    stops: Mapped[list] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
