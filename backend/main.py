import os
import uuid
from datetime import datetime
from typing import Any, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.database_models import (
    ActivityLog,
    CheckpointAttempt,
    CommunityPost,
    CustomTrack,
    GeneratedLesson,
    GeneratedPathway,
    PathwayStep,
    QuizAttempt,
    ThreadMessage,
    User,
    UserPreference,
    UserStats,
    UserTrackProgress,
)
from backend.pathway_repository import (
    find_cached_pathway,
    normalize_goal,
    save_pathway,
)

app = FastAPI(
    title="AI Mech Lab API",
    description="Backend for AI-powered learning pathways and hardware engineering.",
    version="0.1.0",
)

# CORS configuration allowing React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------
class LoginRequest(BaseModel):
    identifier: str
    password: Optional[str] = None


class RegisterRequest(BaseModel):
    firstName: str = ""
    middleName: str = ""
    lastName: str = ""
    country: str = "Nigeria"
    city: str = "Lagos"
    phoneOrEmail: str
    fieldOfStudy: str = "Mechatronics"
    gender: str = "Prefer not to say"
    dob: str = ""
    username: str
    password: str
    termsAccepted: bool = True


class AwardXpRequest(BaseModel):
    amount: int
    activityTitle: str
    category: str = "Courses"
    isProblem: bool = False
    userId: Optional[str] = None


class CheckpointRequest(BaseModel):
    topicId: str
    checkpointIndex: int
    selectedOption: int
    isCorrect: bool
    userId: Optional[str] = None


class QuizRequest(BaseModel):
    deckId: str
    score: int
    totalQuestions: int
    xpEarned: int = 0
    userId: Optional[str] = None


class TopicCompletionRequest(BaseModel):
    trackKey: str
    stepIndex: int = 0
    completedStepsCount: int = 1
    userId: Optional[str] = None


class CustomTrackRequest(BaseModel):
    trackKey: str
    kind: str = "course"
    title: str
    stops: list = Field(default_factory=list)
    userId: Optional[str] = None


class UserPreferencesRequest(BaseModel):
    themePref: str = "system"
    textSize: int = 16
    reduceMotion: bool = False
    lessonReminders: bool = True
    soundEffects: bool = True
    selectedLanguage: str = "English"
    userId: Optional[str] = None


class PathwayGenerateRequest(BaseModel):
    goal: str
    pathwayType: str = "build_learn"  # 'build_learn' | 'build_checklist' | 'learning'
    alreadyKnown: list = Field(default_factory=list)
    userId: Optional[str] = None


class LessonGenerateRequest(BaseModel):
    stepId: int
    goal: str
    stepName: str
    contentType: str = "Video"
    label: str = "Learn"


class ChatMessageRequest(BaseModel):
    promptText: str
    activeContext: dict = Field(default_factory=dict)
    userId: Optional[str] = None


class CommunityPostRequest(BaseModel):
    title: str
    details: str = ""
    tags: list = Field(default_factory=list)
    authorName: Optional[str] = "Mech Learner"
    authorInitials: Optional[str] = "ML"
    userId: Optional[str] = None


class ThreadMessageRequest(BaseModel):
    threadName: str
    text: str
    senderId: Optional[str] = None


# ---------------------------------------------------------
# Default / Seed Data Helpers
# ---------------------------------------------------------
DEFAULT_DEMO_USER_ID = "usr-mech-learner"


def get_or_create_demo_user(db: Session) -> User:
    user = db.get(User, DEFAULT_DEMO_USER_ID)
    if not user:
        user = User(
            id=DEFAULT_DEMO_USER_ID,
            username="mechlearner",
            phone_or_email="learner@aimechlab.local",
            password_hash="demo_hash",
            first_name="Mech",
            middle_name="",
            last_name="Learner",
            country="Nigeria",
            city="Lagos",
            field_of_study="Mechatronics",
            gender="Prefer not to say",
            dob="2004-05-14",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Initialize user stats
        stats = UserStats(
            user_id=user.id,
            xp=1250,
            level=7,
            labs_completed=18,
            quiz_score_avg=86,
            streak_days=6,
            daily_problems_solved=0,
            achievements_count=24,
        )
        db.add(stats)

        # Initialize preferences
        prefs = UserPreference(
            user_id=user.id,
            theme_pref="system",
            text_size=16,
            reduce_motion=False,
            lesson_reminders=True,
            sound_effects=True,
            selected_language="English",
        )
        db.add(prefs)

        # Initialize demo activities
        sample_activities = [
            ("act-1", "🧪", "#DDF5E3", "Completed lab: Line Following Robot", "Robotics"),
            ("act-2", "⚡", "#FDE8E8", "Scored 100% on Circuit Analysis Quiz", "Electronics"),
            ("act-3", "📖", "#E1EFFE", "Studied Topic 2.1: Voltage & Resistance", "Mechatronics"),
        ]
        for aid, icon, bg, title, cat in sample_activities:
            db.add(ActivityLog(id=aid, user_id=user.id, icon=icon, bg=bg, title=title, category=cat))

        # Initialize sample community post if empty
        post = CommunityPost(
            id="post-sample-1",
            user_id=user.id,
            author_name="Mech Learner",
            author_initials="ML",
            author_role="Learner",
            title="How do I wire an HC-SR04 with a 3.3V ESP32?",
            details="The Echo pin outputs 5V—should I use a voltage divider or logic level shifter?",
            tags=["Robotics", "Mechatronics", "Embedded"],
            upvotes=5,
            replies_count=2,
        )
        db.add(post)
        db.commit()

    return user


# ---------------------------------------------------------
# Health Check & Root
# ---------------------------------------------------------
@app.get("/")
def home():
    return {
        "message": "Welcome to AI Mech Lab API!",
        "status": "running",
        "database": "PostgreSQL connected",
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    # Verify DB connectivity
    try:
        db.execute(select(1)).first()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {e}"

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": "AI Mech Lab API",
        "database": db_status,
    }


# ---------------------------------------------------------
# 1. Authentication Endpoints
# ---------------------------------------------------------
@app.post("/api/auth/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = db.scalar(
        select(User).where(
            (User.username == payload.username) | (User.phone_or_email == payload.phoneOrEmail)
        )
    )
    if existing_user:
        return {
            "ok": False,
            "error": "A user with this username or email/phone already exists.",
            "fieldErrors": {
                "un": existing_user.username == payload.username,
                "ph": existing_user.phone_or_email == payload.phoneOrEmail,
            },
        }

    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    user = User(
        id=user_id,
        username=payload.username,
        phone_or_email=payload.phoneOrEmail,
        password_hash=payload.password,  # In production, use bcrypt/argon2
        first_name=payload.firstName,
        middle_name=payload.middleName,
        last_name=payload.lastName,
        country=payload.country,
        city=payload.city,
        field_of_study=payload.fieldOfStudy,
        gender=payload.gender,
        dob=payload.dob,
    )
    db.add(user)

    # Create default stats & preferences
    stats = UserStats(user_id=user_id, xp=100, level=1)
    prefs = UserPreference(user_id=user_id)
    db.add(stats)
    db.add(prefs)
    db.commit()

    display_name = f"{payload.firstName} {payload.lastName}".strip() or payload.username
    initials = (
        f"{payload.firstName[:1]}{payload.lastName[:1]}".upper()
        if payload.firstName
        else payload.username[:2].upper()
    )

    return {
        "ok": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "displayName": display_name,
            "avatarInitials": initials,
            "firstName": user.first_name,
            "middleName": user.middle_name,
            "lastName": user.last_name,
            "phoneOrEmail": user.phone_or_email,
            "country": user.country,
            "city": user.city,
            "fieldOfStudy": user.field_of_study,
            "gender": user.gender,
            "dob": user.dob,
            "authenticated": True,
        },
    }


@app.post("/api/auth/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    ident = payload.identifier.strip()
    user = db.scalar(
        select(User).where((User.username == ident) | (User.phone_or_email == ident))
    )

    if not user:
        # Fallback to demo user
        user = get_or_create_demo_user(db)

    display_name = f"{user.first_name} {user.last_name}".strip() or user.username
    initials = (
        f"{user.first_name[:1]}{user.last_name[:1]}".upper()
        if user.first_name
        else user.username[:2].upper()
    )

    return {
        "ok": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "displayName": display_name,
            "avatarInitials": initials,
            "firstName": user.first_name,
            "middleName": user.middle_name,
            "lastName": user.last_name,
            "phoneOrEmail": user.phone_or_email,
            "country": user.country,
            "city": user.city,
            "fieldOfStudy": user.field_of_study,
            "gender": user.gender,
            "dob": user.dob,
            "authenticated": True,
        },
    }


@app.post("/api/auth/logout")
def logout_user():
    return {"ok": True}


@app.get("/api/auth/me")
def get_current_user(userId: Optional[str] = None, db: Session = Depends(get_db)):
    uid = userId or DEFAULT_DEMO_USER_ID
    user = db.get(User, uid) or get_or_create_demo_user(db)
    display_name = f"{user.first_name} {user.last_name}".strip() or user.username
    initials = (
        f"{user.first_name[:1]}{user.last_name[:1]}".upper()
        if user.first_name
        else user.username[:2].upper()
    )
    return {
        "id": user.id,
        "username": user.username,
        "displayName": display_name,
        "avatarInitials": initials,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "phoneOrEmail": user.phone_or_email,
        "country": user.country,
        "city": user.city,
        "fieldOfStudy": user.field_of_study,
        "gender": user.gender,
        "dob": user.dob,
        "authenticated": True,
    }


# ---------------------------------------------------------
# 2. User Progress, Dashboard & Stats Endpoints
# ---------------------------------------------------------
@app.get("/api/user/dashboard")
def get_dashboard_summary(userId: Optional[str] = None, db: Session = Depends(get_db)):
    uid = userId or DEFAULT_DEMO_USER_ID
    get_or_create_demo_user(db)

    stats = db.get(UserStats, uid)
    if not stats:
        stats = UserStats(user_id=uid)
        db.add(stats)
        db.commit()
        db.refresh(stats)

    activities = (
        db.scalars(
            select(ActivityLog)
            .where(ActivityLog.user_id == uid)
            .order_by(desc(ActivityLog.created_at))
            .limit(10)
        ).all()
    )

    feed = [
        {
            "id": a.id,
            "icon": a.icon,
            "bg": a.bg,
            "title": a.title,
            "category": a.category,
            "time": "Just now",
        }
        for a in activities
    ]

    return {
        "learnerStats": {
            "xp": stats.xp,
            "level": stats.level,
            "labsCompleted": stats.labs_completed,
            "quizScoreAvg": stats.quiz_score_avg,
            "streakDays": stats.streak_days,
            "dailyProblemsSolved": stats.daily_problems_solved,
            "achievementsCount": stats.achievements_count,
        },
        "activityFeed": feed,
        "unreadNotifications": False,
    }


@app.post("/api/user/xp")
def award_xp(payload: AwardXpRequest, db: Session = Depends(get_db)):
    uid = payload.userId or DEFAULT_DEMO_USER_ID
    stats = db.get(UserStats, uid)
    if not stats:
        stats = UserStats(user_id=uid)
        db.add(stats)

    stats.xp += payload.amount
    # Every 200 XP increases level
    stats.level = max(1, stats.xp // 200 + 1)
    if payload.isProblem:
        stats.daily_problems_solved += 1

    act_id = f"act-{uuid.uuid4().hex[:8]}"
    activity = ActivityLog(
        id=act_id,
        user_id=uid,
        icon="⚡",
        bg="#FEF08A",
        title=payload.activityTitle,
        category=payload.category,
    )
    db.add(activity)
    db.commit()

    return {
        "ok": True,
        "learnerStats": {
            "xp": stats.xp,
            "level": stats.level,
            "labsCompleted": stats.labs_completed,
            "quizScoreAvg": stats.quiz_score_avg,
            "streakDays": stats.streak_days,
            "dailyProblemsSolved": stats.daily_problems_solved,
            "achievementsCount": stats.achievements_count,
        },
    }


@app.get("/api/user/preferences")
def get_user_preferences(userId: Optional[str] = None, db: Session = Depends(get_db)):
    uid = userId or DEFAULT_DEMO_USER_ID
    pref = db.get(UserPreference, uid)
    if not pref:
        pref = UserPreference(user_id=uid)
        db.add(pref)
        db.commit()

    return {
        "themePref": pref.theme_pref,
        "textSize": pref.text_size,
        "reduceMotion": pref.reduce_motion,
        "lessonReminders": pref.lesson_reminders,
        "soundEffects": pref.sound_effects,
        "selectedLanguage": pref.selected_language,
    }


@app.post("/api/user/preferences")
def update_user_preferences(payload: UserPreferencesRequest, db: Session = Depends(get_db)):
    uid = payload.userId or DEFAULT_DEMO_USER_ID
    pref = db.get(UserPreference, uid)
    if not pref:
        pref = UserPreference(user_id=uid)
        db.add(pref)

    pref.theme_pref = payload.themePref
    pref.text_size = payload.textSize
    pref.reduce_motion = payload.reduceMotion
    pref.lesson_reminders = payload.lessonReminders
    pref.sound_effects = payload.soundEffects
    pref.selected_language = payload.selectedLanguage
    db.commit()

    return {"ok": True}


# ---------------------------------------------------------
# 3. Courses, Tracks & Station Completions
# ---------------------------------------------------------
@app.get("/api/courses/progress")
def get_all_course_progress(userId: Optional[str] = None, db: Session = Depends(get_db)):
    uid = userId or DEFAULT_DEMO_USER_ID
    records = db.scalars(select(UserTrackProgress).where(UserTrackProgress.user_id == uid)).all()
    tracks = {}
    for r in records:
        tracks[r.track_key] = {
            "completed": r.completed_steps_count,
            "lastStepIndex": r.last_step_index,
        }
    return {"tracks": tracks}


@app.post("/api/courses/completion")
def record_topic_completion(payload: TopicCompletionRequest, db: Session = Depends(get_db)):
    uid = payload.userId or DEFAULT_DEMO_USER_ID
    progress = db.scalar(
        select(UserTrackProgress).where(
            UserTrackProgress.user_id == uid,
            UserTrackProgress.track_key == payload.trackKey,
        )
    )
    if not progress:
        progress = UserTrackProgress(
            user_id=uid,
            track_key=payload.trackKey,
            completed_steps_count=payload.completedStepsCount,
            last_step_index=payload.stepIndex,
        )
        db.add(progress)
    else:
        progress.completed_steps_count = max(
            progress.completed_steps_count, payload.completedStepsCount
        )
        progress.last_step_index = payload.stepIndex

    db.commit()
    return {"ok": True}


@app.get("/api/courses/custom-tracks")
def get_custom_tracks(userId: Optional[str] = None, db: Session = Depends(get_db)):
    uid = userId or DEFAULT_DEMO_USER_ID
    tracks = db.scalars(select(CustomTrack).where(CustomTrack.user_id == uid)).all()
    return {
        "tracks": [
            {
                "trackKey": t.track_key,
                "kind": t.kind,
                "title": t.title,
                "stops": t.stops,
            }
            for t in tracks
        ]
    }


@app.post("/api/courses/custom-tracks")
def save_custom_track(payload: CustomTrackRequest, db: Session = Depends(get_db)):
    uid = payload.userId or DEFAULT_DEMO_USER_ID
    existing = db.scalar(select(CustomTrack).where(CustomTrack.track_key == payload.trackKey))
    if existing:
        existing.title = payload.title
        existing.stops = payload.stops
    else:
        new_track = CustomTrack(
            user_id=uid,
            track_key=payload.trackKey,
            kind=payload.kind,
            title=payload.title,
            stops=payload.stops,
        )
        db.add(new_track)

    db.commit()
    return {"ok": True}


# ---------------------------------------------------------
# 4. Interactive Classroom (Checkpoints, Quizzes)
# ---------------------------------------------------------
@app.post("/api/classroom/checkpoint")
def record_checkpoint(payload: CheckpointRequest, db: Session = Depends(get_db)):
    uid = payload.userId or DEFAULT_DEMO_USER_ID
    attempt = CheckpointAttempt(
        user_id=uid,
        topic_id=payload.topicId,
        checkpointIndex=payload.checkpointIndex,
        selected_option=payload.selectedOption,
        is_correct=payload.isCorrect,
    )
    db.add(attempt)

    if payload.isCorrect:
        stats = db.get(UserStats, uid)
        if stats:
            stats.xp += 15
            stats.daily_problems_solved += 1

    db.commit()
    return {"ok": True}


@app.post("/api/classroom/quiz")
def record_quiz(payload: QuizRequest, db: Session = Depends(get_db)):
    uid = payload.userId or DEFAULT_DEMO_USER_ID
    attempt = QuizAttempt(
        user_id=uid,
        deck_id=payload.deckId,
        score=payload.score,
        total_questions=payload.totalQuestions,
        xp_earned=payload.xpEarned,
    )
    db.add(attempt)

    stats = db.get(UserStats, uid)
    if stats:
        stats.xp += payload.xpEarned
        stats.level = max(1, stats.xp // 200 + 1)
        # Update quiz average
        attempts = db.scalars(select(QuizAttempt).where(QuizAttempt.user_id == uid)).all()
        if attempts:
            scores = [(a.score / max(1, a.total_questions)) * 100 for a in attempts]
            stats.quiz_score_avg = int(sum(scores) / len(scores))

    db.commit()
    return {"ok": True}


# ---------------------------------------------------------
# 5. Pathways & AI Assistant (Gemini with Fallbacks)
# ---------------------------------------------------------
@app.post("/api/pathways/generate")
def generate_pathway_endpoint(payload: PathwayGenerateRequest, db: Session = Depends(get_db)):
    goal = payload.goal.strip()
    if not goal:
        raise HTTPException(status_code=400, detail="Goal cannot be empty")

    pathway_type = payload.pathwayType
    fingerprint = "default_fingerprint"

    # Check database cache first
    cached = find_cached_pathway(
        db=db,
        goal=goal,
        pathway_type=pathway_type,
        already_known=payload.alreadyKnown,
        generation_fingerprint=fingerprint,
    )
    if cached:
        return {
            "ok": True,
            "pathwayId": cached.id,
            "goal": cached.goal,
            "pathwayType": cached.pathway_type,
            "steps": [
                {
                    "step_number": s.step_number,
                    "name": s.name,
                    "label": s.label,
                    "type": s.step_type,
                    "video_search_phrase": s.video_search_phrase,
                    "video_length": s.video_length,
                }
                for s in cached.steps
            ],
            "fromCache": True,
        }

    # Generate steps (via Gemini if API key set, or fallback structured track)
    gemini_key = os.getenv("GEMINI_API_KEY")
    steps_data = []

    if gemini_key:
        try:
            from backend.gemini_response_parser import parse_gemini_pathway_response
            from backend.gemini_service import generate_gemini_response_with_fingerprint

            note_map = {
                "build_learn": 1,
                "build_checklist": 2,
                "learning": 3,
            }
            note_num = note_map.get(pathway_type, 1)
            raw_response, fp = generate_gemini_response_with_fingerprint(note_num, goal)
            parsed = parse_gemini_pathway_response(raw_response)
            if parsed.get("steps"):
                steps_data = parsed["steps"]
                fingerprint = fp
        except Exception:
            steps_data = []

    if not steps_data:
        # High quality fallback template steps based on goal
        steps_data = [
            {"step_number": 1, "name": f"Understand System Requirements for {goal}", "label": "Learn", "type": "Video", "video_search_phrase": f"{goal} engineering basics", "video_length": "medium"},
            {"step_number": 2, "name": "Procure Components & Microcontroller Bench", "label": "Action", "type": "Manual", "video_search_phrase": None, "video_length": None},
            {"step_number": 3, "name": "Power Distribution & Safety Regulation", "label": "Learn", "type": "Video", "video_search_phrase": "Power electronics voltage regulator", "video_length": "medium"},
            {"step_number": 4, "name": "Sensor & Actuator Interfacing Circuit", "label": "Learn", "type": "Video", "video_search_phrase": "Sensor wiring microcontroller GPIO", "video_length": "medium"},
            {"step_number": 5, "name": "Firmware Control Loop & Bench Validation", "label": "Action", "type": "Manual", "video_search_phrase": None, "video_length": None},
        ]

    saved = save_pathway(
        db=db,
        goal=goal,
        pathway_type=pathway_type,
        generated_response="Pathway generated",
        steps=steps_data,
        user_id=payload.userId or DEFAULT_DEMO_USER_ID,
        already_known=payload.alreadyKnown,
        generation_fingerprint=fingerprint,
    )

    return {
        "ok": True,
        "pathwayId": saved.id,
        "goal": saved.goal,
        "pathwayType": saved.pathway_type,
        "steps": steps_data,
        "fromCache": False,
    }


@app.post("/api/ai/chat")
def ai_chat_endpoint(payload: ChatMessageRequest):
    prompt = payload.promptText.strip()
    ctx = payload.activeContext or {}
    tier = ctx.get("socraticTier", 1)
    topic_id = ctx.get("topicId", "")

    # Try Gemini if key configured
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            from backend.gemini_service import generate_gemini_response
            response_text = generate_gemini_response(5, prompt)
            return {
                "f": ["Analyzing question", "Consulting curriculum", "Synthesizing response"],
                "a": response_text,
                "list": None,
                "l": ["Back to lesson", "#lesson"] if topic_id else None,
            }
        except Exception:
            pass

    # Socratic Coaching response
    tier_messages = {
        1: f"💡 **Socratic Hint (Tier 1)**: Consider the relationship between the inputs and outputs here. What fundamental physical principle or formula governs this behavior?",
        2: f"🔍 **Guided Breakdown (Tier 2)**: Let's isolate the variables. Check the polarity, calculate the expected current using Ohm's Law (V = I × R), and check if the sensor value falls within tolerance.",
        3: f"🎯 **Solution Guidance (Tier 3)**: Here is the direct engineering approach: Verify your ground return path, ensure signal decoupling capacitors are placed close to the VCC pin, and test with the oscilloscope bench.",
    }
    answer = tier_messages.get(tier, tier_messages[1])

    return {
        "f": [
            "Reading current lesson context",
            f"Applying Socratic Tier {tier} guidance",
            "Formulating guiding prompt",
        ],
        "a": answer,
        "list": None,
        "l": ["Back to lesson", "#lesson"] if topic_id else None,
    }


# ---------------------------------------------------------
# 6. Community Endpoints
# ---------------------------------------------------------
@app.get("/api/community/posts")
def get_community_posts(db: Session = Depends(get_db)):
    get_or_create_demo_user(db)
    posts = db.scalars(select(CommunityPost).order_by(desc(CommunityPost.created_at))).all()
    return {
        "posts": [
            {
                "id": p.id,
                "author": p.author_name,
                "initials": p.author_initials,
                "role": p.author_role,
                "title": p.title,
                "details": p.details,
                "tags": p.tags or [],
                "upvotes": p.upvotes,
                "replies": p.replies_count,
                "time": "Recent",
            }
            for p in posts
        ]
    }


@app.post("/api/community/posts")
def create_community_post(payload: CommunityPostRequest, db: Session = Depends(get_db)):
    uid = payload.userId or DEFAULT_DEMO_USER_ID
    post_id = f"post-{uuid.uuid4().hex[:8]}"
    post = CommunityPost(
        id=post_id,
        user_id=uid,
        author_name=payload.authorName or "Mech Learner",
        author_initials=payload.authorInitials or "ML",
        author_role="Learner",
        title=payload.title,
        details=payload.details,
        tags=payload.tags,
        upvotes=1,
        replies_count=0,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "ok": True,
        "post": {
            "id": post.id,
            "author": post.author_name,
            "initials": post.author_initials,
            "role": post.author_role,
            "title": post.title,
            "details": post.details,
            "tags": post.tags,
            "upvotes": post.upvotes,
            "replies": post.replies_count,
            "time": "Just now",
        },
    }


@app.get("/api/community/threads")
def get_thread_messages(threadName: str, db: Session = Depends(get_db)):
    messages = db.scalars(
        select(ThreadMessage)
        .where(ThreadMessage.thread_name == threadName)
        .order_by(ThreadMessage.created_at)
    ).all()
    return {
        "messages": [
            {
                "id": m.id,
                "text": m.text,
                "isSender": m.is_sender,
                "time": "Just now",
            }
            for m in messages
        ]
    }


@app.post("/api/community/threads")
def send_thread_message(payload: ThreadMessageRequest, db: Session = Depends(get_db)):
    msg = ThreadMessage(
        thread_name=payload.threadName,
        sender_id=payload.senderId or DEFAULT_DEMO_USER_ID,
        text=payload.text,
        is_sender=True,
    )
    db.add(msg)
    db.commit()
    return {"ok": True}
