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
