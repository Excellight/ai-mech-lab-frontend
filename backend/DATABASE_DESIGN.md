AI Mech Lab — Database Design

Status: Proposed
Purpose: Define the database requirements for Gemini integration and AI-generated learning content.

1. Scope and Responsibilities

This database design focuses on the information required by the Gemini integration.

The primary responsibilities of this work are:

- Persisting AI-generated learning and building pathways.
- Persisting pathway steps and their metadata.
- Storing generated lessons and written manuals.
- Caching YouTube video search results.
- Reusing previously generated results to reduce unnecessary API calls.

The other backend developer is responsible for implementing the application's remaining APIs. Database ownership, existing models, and relationships must be coordinated with that developer before implementation.

Do not create duplicate user, authentication, progress, or community tables if equivalent tables already exist.

2. Database Technology

- Database: PostgreSQL
- ORM: SQLAlchemy
- Database migrations: Alembic
- AI provider: Google Gemini
- Video discovery: YouTube Data API

API keys and database credentials must remain on the backend and must never be committed to GitHub.

3. Proposed Tables

A. generated_pathways

Stores generated learning and building pathways.

Proposed fields:

- "id": Primary key.
- "goal": Original project goal or learning subject.
- "normalized_goal": Normalized goal or subject used for matching equivalent requests.
- "pathway_type": "build_learn", "build_checklist", or "learning".
- "generated_content": Original or normalized pathway response, stored as JSON.
- "note_version": Identifies the Gemini instruction version used.
- "created_at": Creation timestamp.
- "updated_at": Last update timestamp.

Requirements:

- Reuse saved results where the request matches the caching rules.
- Preserve the original order of steps.
- Keep learning pathways distinct from build checklists.
- Do not regenerate an existing pathway unnecessarily.

B. pathway_steps

Stores the individual steps belonging to a pathway.

Proposed fields:

- "id": Primary key.
- "pathway_id": Foreign key referencing "generated_pathways".
- "step_number": Position of the step in the pathway.
- "step_name": Step title.
- "step_type": "Video" or "Manual".
- "step_label": "Learn", "Refresher", or null when labels do not apply.
- "video_search_phrase": Search phrase for a video step; null for manual steps.
- "video_length": "medium", "long", or null for manual steps.
- "created_at": Creation timestamp.

Requirements:

- Preserve step order and exact step names.
- Manual steps must not contain video-search phrases or video lengths.
- Refresher video steps use medium-length videos.
- Newly edited pathways must retain the requested changes.

C. generated_lessons

Stores lessons and manuals generated when a user opens a pathway step.

Proposed fields:

- "id": Primary key.
- "pathway_step_id": Foreign key referencing "pathway_steps".
- "goal": Associated project goal or learning subject.
- "step_name": Name of the lesson step.
- "content_type": "Video" or "Manual".
- "label": "Learn" or "Refresher", where applicable.
- "lesson_content": Generated text.
- "note_version": Gemini instruction version.
- "created_at": Creation timestamp.

Requirements:

- Reuse saved lesson content for equivalent requests.
- Keep refresher summaries separate from full lessons.
- Preserve the required response structure for lessons and manuals.

D. video_cache

Stores YouTube videos selected for Gemini-generated video-search phrases.

Proposed fields:

- "id": Primary key.
- "normalized_search_phrase": Normalized search phrase used for matching.
- "original_search_phrase": Original phrase returned by Gemini.
- "video_id": YouTube video identifier.
- "video_title": Video title.
- "video_url": Video URL.
- "duration_seconds": Actual duration, when available.
- "requested_length": Requested duration category.
- "is_embeddable": Whether the video can be embedded.
- "created_at": Creation timestamp.

Requirements:

- Search YouTube when no suitable cached result exists.
- Select an embeddable video.
- Save the selected result and reuse it for the same search phrase.
- Do not repeatedly search for a phrase that already has a valid cached result.
- Handle cases where YouTube returns no suitable video.

4. Caching Strategy

Caching is required to reduce unnecessary Gemini and YouTube API requests.

Pathway caching

- Normalize goal or subject text for matching.
- Distinguish between pathway types.
- Include the relevant Gemini note version in the cache strategy.
- Preserve the first valid generated result for matching requests.
- Ensure differences in known skills do not unnecessarily change the pathway's step structure.

Lesson caching

- Match saved lessons using the associated goal, step, content type, label, and instruction version as appropriate.
- Reuse the saved result when the request is equivalent.
- Avoid returning a refresher summary when a full lesson is required, or vice versa.

Video caching

- Normalize video-search phrases.
- Reuse previously selected videos for matching phrases.
- Verify that cached results are suitable for embedding before returning them.

Cache matching rules must be finalised before implementation so that different requests do not accidentally receive inappropriate results.

5. Track Editing

Gemini Note 6 allows users to request changes to an existing track.

When a track is edited:

- Apply only the requested change.
- Preserve unaffected step names, order, types, labels, and video metadata.
- Renumber steps after changes.
- Preserve the previous version when version history is required.
- Save the updated track so it can be retrieved later.

The implementation should coordinate with the existing user-progress system before defining how user-specific track ownership and progress are stored.

6. Gemini Response Handling

The Gemini integration must:

- Send the correct instruction note with every request.
- Use a low temperature, approximately 0.2, for Notes 1, 2, 3, and 6.
- Parse response fields by their labels rather than their positions.
- Recognise "NOT_AVAILABLE" and "NOT_AN_EDIT" as exact special responses.
- Handle manual steps without expecting video metadata.
- Handle Note 6's optional "Note:" line.
- Preserve the original six instruction notes without changing their wording.

Generated content must be validated before being saved.

7. Security

- Store API keys and database credentials in backend environment variables.
- Never place secrets in frontend code.
- Never commit ".env" files or credentials to GitHub.
- Validate generated content before saving it.
- Use parameterised database operations through SQLAlchemy.
- Coordinate database access with the existing authentication and authorisation implementation.

8. Coordination With the Other Backend Developer

Before implementing the tables, confirm:

- Whether a "users" table already exists.
- How user-specific pathways will be associated with accounts.
- Whether the existing backend already has pathway or progress models.
- How database migrations will be managed.
- Which developer owns shared database models and schema changes.
- How the frontend will receive pathway and lesson data.

Avoid creating duplicate tables or incompatible relationships.

9. Implementation Order

1. Review the existing database foundation.
2. Coordinate shared database models with the backend developer.
3. Finalise the pathway and caching schema.
4. Implement SQLAlchemy models and Alembic migrations.
5. Implement Gemini request construction and response parsing.
6. Implement pathway and lesson persistence.
7. Implement YouTube search and video caching.
8. Test caching, validation, editing, and error handling.
9. Integrate with the agreed API contracts.

This document describes the proposed database design. It does not indicate that these tables or features have already been implemented.
