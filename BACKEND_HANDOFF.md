# AI Mech Lab — Frontend-to-Backend Integration Handoff Guide

## 1. Architecture Overview & Service Layer Map

The **AI Mech Lab** React application (`ai-mech-lab-react/`) is a completed 27-screen interactive classroom featuring 22 verbatim PDF lessons, 200 course diagrams, 46 interactive checkpoints, 5 specialized quiz decks, 9 live simulation benches, a 3-tier Socratic AI coach, and Learning-to-Building pathway bridges.

All UI components in `src/screens/` and `src/components/` communicate exclusively with `src/context/MechLabContext.jsx` and the **5 service adapter modules** in `src/services/`. The backend developer can integrate database persistence, authentication, and live AI services by updating `src/services/` **without modifying or rebuilding any UI screen component**.

| Service Module | Primary Responsibilities | Consumed By |
| :--- | :--- | :--- |
| `src/services/authService.js` | Credential login, OAuth (`google`, `github`, `linkedin`), account registration, session hydration, logout | `AuthScreen.jsx`, `SignupScreen.jsx`, `ProfileScreen.jsx`, `SettingsScreen.jsx`, `MechLabContext.jsx` |
| `src/services/courseService.js` | Course & topic lookup (`coursesData.json`), lesson/station completion persistence, custom MechTrack persistence | `CoursesScreen.jsx`, `CourseTrackScreen.jsx`, `ProjectTrackScreen.jsx`, `LessonScreen.jsx`, `MechTrackMap.jsx`, `MechLabContext.jsx` |
| `src/services/userProgressService.js` | Learner XP/level/streak calculation, Recent Activity feed, checkpoint/quiz/experiment/game telemetry, notifications, user settings | `DashboardScreen.jsx`, `ProfileScreen.jsx`, `ActivityScreen.jsx`, `LessonScreen.jsx`, `QuizScreen.jsx`, `ExperimentScreen.jsx`, `NotificationsScreen.jsx`, `AppearanceScreen.jsx`, `SettingsScreen.jsx`, `LanguageScreen.jsx` |
| `src/services/aiAssistantService.js` | Mech Bot conversational planner, custom MechTrack generator, 3-tier Socratic lesson coaching, chat history | `ChatScreen.jsx`, `GlobalOverlays.jsx`, `LessonScreen.jsx`, `QuizScreen.jsx`, `GenerateTrackBar.jsx`, `MechLabContext.jsx` |
| `src/services/communityService.js` | Community feed (`Feed`, `Questions`, `Showcase`), question submission, direct/study-group message threads | `CommunityScreen.jsx`, `AskScreen.jsx`, `MessagesScreen.jsx`, `ThreadScreen.jsx`, `MechLabContext.jsx` |

---

## 2. Static Data vs. Backend-Driven Data Inventory

| Data Asset / State | Current Source | Backend Integration Strategy |
| :--- | :--- | :--- |
| **22 Course PDFs & 200 Diagrams** | `public/assets/courses/` & `src/data/coursesData.json` | **Static / CDN Ready** — Can remain served as static assets or be hydrated from a CMS/database matching the `coursesData.json` schema. |
| **46 Lesson Checkpoints & 5 Quiz Decks** | `src/data/interactiveClassroomData.js` (`TOPIC_CHECKPOINTS`, `QUIZ_DECKS`) | **Static Curriculum + Dynamic Attempts** — Questions can remain bundled or be fetched from the backend; learner attempts and scores should be persisted via `userProgressService.js`. |
| **Learning-to-Building Bridges** | `src/data/interactiveClassroomData.js` (`PROJECT_LESSON_BRIDGES`, `COURSE_TO_PROJECT_MAP`) | **Static Curriculum Mapping** — Maps each project station (`obstacle`, `linecar`, `temp`) to its required course lesson. |
| **Countries & Cities Directory** | `src/data/initialData.js` (`COUNTRIES`, `CITIES_BY_COUNTRY`) | **Static Reference Data** — Used by `ComboBox.jsx` on `#signup`. |
| **User Account & Session** | `src/services/authService.js` (`localStorage: mlUserSession_v1`) | **Requires Backend Service** — Replace local session stub with real authentication & user record. |
| **Track Progress (`tracks[key].a`)** | `src/services/courseService.js` (`localStorage: mlCourseProgress_v1`) | **Requires Backend Service** — Sync completed lesson/station counts per track (`drone`, `robotics`, `ai`, `mechatronics`, `micro`, `elec`, `sensors`, `obstacle`, `linecar`, `temp`). |
| **Custom Generated MechTracks** | `src/services/courseService.js` (`localStorage: mlCustomTracks_v1`) | **Requires Backend Service** — Persist user-generated course and project tracks (`k`, `t`, `s`, `a`, `m`, `f`). |
| **Learner Stats (XP, Level, Streak, Achievements)** | `src/services/userProgressService.js` (`INITIAL_LEARNER_STATS`) | **Requires Backend Service** — Persist `xp`, `level`, `labsCompleted`, `quizScoreAvg`, `streakDays`, `dailyProblemsSolved`, and `achievementsCount`. |
| **Activity Feed & Notifications** | `src/services/userProgressService.js` (`INITIAL_ACTIVITY_FEED`, `INITIAL_NOTIFICATIONS`) | **Requires Backend Service** — Fetch and append user activity logs and notification read status. |
| **Mech Bot AI & Socratic Coach** | `src/services/aiAssistantService.js` (`planMechBotResponse`, `getSocraticGuidance`) | **Requires Backend Service** — Connect to backend LLM/RAG service with curriculum context (`coursesData.json`) and persist chat sessions (`#t-hist`). |
| **Community Posts & Message Threads** | `src/services/communityService.js` (`INITIAL_COMMUNITY_POSTS`, `INITIAL_ACTIVE_THREAD`) | **Requires Backend Service** — Persist community Q&A/Showcase posts and direct/group message threads. |
| **User Preferences & Accessibility** | `src/services/userProgressService.js` (`syncUserPreferences`) | **Requires Backend Service** — Sync `themePref`, `textSize`, `reduceMotion`, `lessonReminders`, `soundEffects`, and `selectedLanguage`. |

---

## 3. Feature-by-Feature Backend Requirements & Data Contracts

> **Note**: No specific URL paths or backend frameworks are assumed below. Each operation is defined by its **Service Function**, **Operation Purpose**, **Request Payload Structure**, and **Expected Response Structure**.

### 3.1 Authentication & User Accounts (`src/services/authService.js`)
- **Screens**: `#auth` (`AuthScreen.jsx`), `#signup` (`SignupScreen.jsx`), `#profile` (`ProfileScreen.jsx`), `#settings` (`SettingsScreen.jsx`)
- **Expected Operations**:
  1. **Credential Login (`loginWithCredentials`)**
     - **Request Payload**:
       ```json
       {
         "identifier": "learner@example.com",
         "password": "user-password"
       }
       ```
     - **Response Payload**:
       ```json
       {
         "ok": true,
         "user": {
           "id": "usr_123",
           "username": "mechlearner",
           "displayName": "Mech Learner",
           "avatarInitials": "ML",
           "firstName": "Mech",
           "middleName": "",
           "lastName": "Learner",
           "phoneOrEmail": "learner@example.com",
           "country": "Nigeria",
           "city": "Lagos",
           "fieldOfStudy": "Mechatronics",
           "gender": "Prefer not to say",
           "dob": "2004-05-14"
         }
       }
       ```
  2. **OAuth Login (`loginWithOAuth`)**
     - **Providers**: `'google' | 'github' | 'linkedin'`
     - **Response Payload**: Same `{ ok, user, error? }` structure after OAuth callback/exchange.
  3. **Account Registration (`registerUser`)**
     - **Request Payload** (maps 1:1 to `#signup` form inputs `#fn`, `#mn`, `#ln`, `#cc`, `#cy`, `#ph`, `#fs`, `#gd`, `#db`, `#un`, `#pw`, `#tc`):
       ```json
       {
         "firstName": "Ada",
         "middleName": "",
         "lastName": "Okafor",
         "country": "Nigeria",
         "city": "Lagos",
         "phoneOrEmail": "ada@example.com",
         "fieldOfStudy": "Mechatronics",
         "gender": "Female",
         "dob": "2005-08-20",
         "username": "ada_mech",
         "password": "securePassword123",
         "termsAccepted": true
       }
       ```
     - **Response Payload**:
       ```json
       {
         "ok": true,
         "user": { "id": "usr_124", "username": "ada_mech", "displayName": "Ada Okafor", "avatarInitials": "AO" },
         "fieldErrors": { "un": false, "ph": false },
         "error": null
       }
       ```
  4. **Logout (`logoutUser`)**: Clears session token/cookie and returns `{ "ok": true }`.

---

### 3.2 Dashboard, Learner Stats, Activity & Notifications (`src/services/userProgressService.js`)
- **Screens**: `#dash` (`DashboardScreen.jsx`), `#profile` (`ProfileScreen.jsx`), `#activity` (`ActivityScreen.jsx`), `#notifications` (`NotificationsScreen.jsx`)
- **Expected Operations**:
  1. **Fetch Learner Dashboard & Profile Summary**
     - **Response Payload**:
       ```json
       {
         "learnerStats": {
           "xp": 1250,
           "level": 7,
           "labsCompleted": 18,
           "quizScoreAvg": 86,
           "streakDays": 6,
           "dailyProblemsSolved": 0,
           "achievementsCount": 24
         },
         "activityFeed": [
           {
             "id": "act-1",
             "icon": "🧪",
             "bg": "#DDF5E3",
             "title": "Completed lab: Line Following Robot",
             "category": "Robotics",
             "time": "2h ago"
           }
         ],
         "unreadNotifications": true
       }
       ```
  2. **Award XP & Log Activity (`awardXp` / `computeNextLearnerStats`)**
     - **Request Payload**:
       ```json
       {
         "amount": 15,
         "activityTitle": "Solved checkpoint in Voltage, Current, and Resistance",
         "category": "Courses",
         "isProblem": true
       }
       ```
  3. **Mark Notifications Read (`markAllNotificationsRead`)**
     - Updates unread state so the red indicator dot (`.ic.dot` on `#dash` and `.ud` on `#notifications`) clears.

---

### 3.3 Courses, Lesson Content & Learning Pathways (`src/services/courseService.js`)
- **Screens**: `#courses` (`CoursesScreen.jsx`), `#course` (`CourseTrackScreen.jsx`), `#projects` (`ProjectsScreen.jsx`), `#project` (`ProjectTrackScreen.jsx`), `#lesson` (`LessonScreen.jsx`)
- **Expected Operations**:
  1. **Course & Topic Content Schema (`coursesData.json`)**
     - Each of the 22 PDF lessons follows this exact structure (must be preserved if served from a backend database):
       ```json
       {
         "topicId": "mechatronics-m2-t2.1",
         "courseSlug": "mechatronics",
         "courseTitle": "Mechatronics",
         "courseSubtitle": "Mechatronics · Module 2",
         "moduleNumber": 2,
         "moduleTitle": "Basic Electronics",
         "moduleLabel": "Module 2 · Topic 2.1",
         "topicCode": "2.1",
         "title": "Voltage, Current, and Resistance",
         "pageCount": 6,
         "imageCount": 9,
         "pdfUrl": "/assets/courses/mechatronics/pdfs/m2-t2.1.pdf",
         "coverImage": "/assets/courses/mechatronics/images/m2-t2.1/page1_img1.png",
         "blocks": [
           { "type": "heading", "level": 1, "text": "Topic 2.1: Voltage, Current, and Resistance" },
           { "type": "paragraph", "text": "...", "spans": [{ "text": "...", "bold": false, "italic": false, "code": false }] },
           { "type": "figure", "src": "/assets/courses/mechatronics/images/m2-t2.1/page2_img1.png", "caption": "..." },
           { "type": "code", "text": "..." },
           { "type": "list", "ordered": false, "items": ["..."] },
           { "type": "table", "headers": ["..."], "rows": [["..."]] }
         ]
       }
       ```
  2. **Save Lesson or Project Station Completion (`saveTopicCompletion`)**
     - **Request Payload**:
       ```json
       {
         "trackKey": "mechatronics",
         "stepIndex": 3,
         "completedStepsCount": 4
       }
       ```
  3. **Save Custom Generated MechTrack (`saveCustomTrack`)**
     - **Request Payload**:
       ```json
       {
         "trackKey": "g1729245000000",
         "kind": "course",
         "title": "Robotics Essentials",
         "stops": ["What is a robot", "Sensors and perception", "Motors and actuators", "Control and PID"]
       }
       ```

---

### 3.4 Interactive Classroom: Checkpoints, Quizzes, Labs & Games (`src/services/userProgressService.js`)
- **Screens**: `#lesson` (`LessonScreen.jsx`), `#quizzes` (`QuizzesScreen.jsx`), `#quiz` (`QuizScreen.jsx`), `#lab` (`AiLabScreen.jsx`), `#experiment` (`ExperimentScreen.jsx`), `#games` (`GamesScreen.jsx`), `#game` (`GameScreen.jsx`)
- **Expected Operations**:
  1. **Checkpoint Attempt (`recordCheckpointAttempt`)**
     - **Request Payload**:
       ```json
       {
         "topicId": "mechatronics-m2-t2.1",
         "checkpointIndex": 0,
         "selectedOption": 1,
         "isCorrect": true
       }
       ```
  2. **Quiz Completion (`recordQuizCompletion`)**
     - **Request Payload**:
       ```json
       {
         "deckId": "circuits",
         "score": 4,
         "totalQuestions": 4,
         "xpEarned": 60
       }
       ```
  3. **AI Lab Experiment Run (`#experiment`) & Mini-Game Score (`#game`)**
     - **Request Payload**:
       ```json
       {
         "activityType": "experiment",
         "title": "Hand-sign model",
         "sampleCount": 20,
         "threshold": 75,
         "accuracy": 90,
         "xpEarned": 30
       }
       ```

---

### 3.5 Mech Bot AI Assistant & Socratic Coach (`src/services/aiAssistantService.js`)
- **Screens**: `#chat` (`ChatScreen.jsx`), Floating Bot FAB (`GlobalOverlays.jsx`), `#lesson` Socratic Coach (`LessonScreen.jsx`)
- **Expected Operations**:
  1. **Generate Context-Aware Reply (`planMechBotResponse` / `sendChatMessage`)**
     - **Request Payload**:
       ```json
       {
         "promptText": "Give me a Socratic hint (Tier 1) for this concept",
         "activeContext": {
           "currentScreen": "lesson",
           "courseKey": "mechatronics",
           "stepIndex": 3,
           "topicId": "mechatronics-m2-t2.1",
           "socraticTier": 1
         }
       }
       ```
     - **Response Payload** (consumed directly by `ChatScreen.jsx`):
       ```json
       {
         "f": [
           "Reading current lesson",
           "Checking your step",
           "Formulating guiding question",
           "Preparing Socratic hint"
         ],
         "a": "🤔 Let’s think through this together without spoiling the answer: Look at V = I × R...",
         "list": null,
         "l": ["Back to active lesson", "#lesson"]
       }
       ```
     - **Important**: All LLM API keys must remain strictly on the backend server.

---

### 3.6 Community Q&A, Showcase & Direct Messaging (`src/services/communityService.js`)
- **Screens**: `#community` (`CommunityScreen.jsx`), `#ask` (`AskScreen.jsx`), `#messages` (`MessagesScreen.jsx`), `#thread` (`ThreadScreen.jsx`)
- **Expected Operations**:
  1. **Create Community Question (`addCommunityQuestion` / `buildCommunityPost`)**
     - **Request Payload**:
       ```json
       {
         "title": "How do I wire an HC-SR04 with a 3.3V ESP32?",
         "details": "The Echo pin outputs 5V—should I use a voltage divider?",
         "tags": ["Robotics", "Mechatronics", "Embedded"]
       }
       ```
  2. **Send Direct / Group Thread Message (`sendThreadMessage`)**
     - **Request Payload**:
       ```json
       {
         "threadName": "Amaka K.",
         "text": "Thanks, the voltage divider worked!"
       }
       ```

---

### 3.7 User Preferences & Settings (`src/services/userProgressService.js`)
- **Screens**: `#appearance` (`AppearanceScreen.jsx`), `#settings` (`SettingsScreen.jsx`), `#language` (`LanguageScreen.jsx`)
- **Request Payload (`syncUserPreferences`)**:
  ```json
  {
    "themePref": "dark",
    "textSize": 16,
    "reduceMotion": false,
    "lessonReminders": true,
    "soundEffects": false,
    "selectedLanguage": "English"
  }
  ```

---

## 4. Authentication, Session & Error-Handling Requirements

1. **Session Persistence**:
   - The frontend supports either **HTTP-only cookies** (`credentials: 'include'`) or **Bearer tokens** managed inside `src/services/authService.js`.
   - When an unauthenticated user logs out via `#settings` or `#profile`, `logoutUser()` clears the local session and navigates to `#auth`.
2. **Form Validation & Field-Level Errors (`#signup`)**:
   - `SignupScreen.jsx` highlights invalid inputs using the `.f.bad` CSS class (`invalidFields = { fn, ln, ph, un, pw }`) and displays the error message inside `<p className="msg" id="sm" role="alert">`.
   - When the backend returns validation errors (e.g. duplicate username or email), returning `{ ok: false, fieldErrors: { un: true }, error: "Username is already taken" }` from `registerUser()` automatically highlights `#un` with `.f.bad` and renders the message in `#sm`.
3. **Global Toast Feedback (`#toast`)**:
   - Transient network or action feedback should be surfaced via `showToast(message)` in `MechLabContext.jsx`, which renders inside `<div className="toast show" id="toast" role="status">`.
4. **Offline / Fallback Safety**:
   - Keep the local fallback data in `src/data/` so that if the backend is unreachable or running in offline classroom mode, all 22 PDF lessons, 9 Concept Explorers, and 5 quiz decks continue to function without crashing.

---

## 5. Division of Responsibilities

### Frontend Developer (Completed)
- All 27 screens converted to React components preserving 100% of the original AI Mech Lab UI/UX, CSS variables, dark/light themes, and responsive layout.
- All 22 course PDFs and 200 extracted figures integrated into `coursesData.json` and `public/assets/courses/`.
- All 4 interactive classroom phases implemented (Step-by-Step mode, 46 checkpoints, 5 quiz decks, 9 Concept Explorers, 3-tier Socratic Mech Bot UI, Learning-to-Building station bridges, and connected XP/streak loop).
- Clean service layer (`src/services/`) isolating all data and backend touchpoints from UI components.

### Backend Developer (Next Steps)
- Implement database tables/collections for Users, TrackProgress, CustomTracks, CheckpointAttempts, QuizResults, ActivityFeed, Notifications, ChatHistory, CommunityPosts, and MessageThreads.
- Connect the functions in `src/services/authService.js`, `src/services/courseService.js`, `src/services/userProgressService.js`, `src/services/aiAssistantService.js`, and `src/services/communityService.js` to the backend API.
- Host the LLM/RAG pipeline behind `aiAssistantService.js` using `src/data/coursesData.json` and `src/data/interactiveClassroomData.js` as the grounding knowledge base.

---

## 6. Questions the Backend Developer Must Confirm

Before wiring the production API into `src/services/`, the backend developer should confirm:
1. **API Protocol & Transport**: Will the backend expose REST endpoints, GraphQL, or a BaaS SDK (e.g., Supabase / Firebase / custom Node/Python API)?
2. **Authentication Mechanism**: Will sessions use HTTP-only cookies or JWT Bearer tokens, and which OAuth redirect URLs should be configured for Google, GitHub, and LinkedIn?
3. **Static vs. Database Course Delivery**: Will the 22 PDFs and 200 images in `public/assets/courses/` be served from the frontend static host/CDN, or moved to an object storage bucket (S3/GCS)?
4. **Mech Bot LLM Streaming vs. JSON**: Will the backend return the complete `{ f, a, list, l }` response object in a single JSON response, or stream tokens via Server-Sent Events (SSE) / WebSockets?
5. **Real-Time Messaging & Notifications**: Should `#messages` / `#thread` and `#notifications` use standard HTTP polling on screen open, or WebSocket/SSE push updates?
