/**
 * User Progress, Telemetry, Gamification & Preferences Service Layer
 *
 * STATUS: Currently operates in local/in-memory mode with safe localStorage persistence
 * while preserving the exact baseline KPI values required by the original AI Mech Lab design.
 * BACKEND INTEGRATION POINT: Connect these functions to the backend database to persist
 * learner XP, daily streaks, activity feed, checkpoint mastery, quiz attempts, lab runs,
 * notifications, and user settings across devices.
 */

export const INITIAL_LEARNER_STATS = {
  xp: 1250,
  level: 7,
  labsCompleted: 18,
  quizScoreAvg: 86,
  streakDays: 6,
  dailyProblemsSolved: 0,
  achievementsCount: 24
};

export const INITIAL_ACTIVITY_FEED = [
  {
    id: 'act-1',
    icon: '🧪',
    bg: '#DDF5E3',
    title: 'Completed lab: Line Following Robot',
    category: 'Robotics',
    time: '2h ago'
  },
  {
    id: 'act-2',
    icon: '💡',
    bg: '#EADFFF',
    title: 'Scored 90% in Sensors Quiz',
    category: 'Quizzes',
    time: 'Yesterday'
  },
  {
    id: 'act-3',
    icon: '📘',
    bg: '#DCE8FF',
    title: 'Started course: Computer Vision Basics',
    category: 'Courses',
    time: '2d ago'
  },
  {
    id: 'act-4',
    icon: '🏆',
    bg: '#FFF0C7',
    title: 'Earned achievement: Circuit Master',
    category: 'Achievements',
    time: '3d ago'
  },
  {
    id: 'act-5',
    icon: '✅',
    bg: '#DDF5E3',
    title: 'Finished module: Battery Technology',
    category: 'Custom Drone Build',
    time: '4d ago'
  },
  {
    id: 'act-6',
    icon: '👥',
    bg: 'var(--tile)',
    title: 'Joined the Robotics study group',
    category: 'Community',
    time: '5d ago'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    icon: '🧪',
    bg: '#DDF5E3',
    text: 'Lab reminder: PID Control Lab is due Oct 9',
    time: '2h ago',
    targetScreen: 'project',
    unread: true
  },
  {
    id: 'notif-2',
    icon: '🏆',
    bg: '#FFF0C7',
    text: 'You earned Circuit Master',
    time: 'Yesterday',
    targetScreen: 'profile',
    unread: true
  },
  {
    id: 'notif-3',
    icon: '💬',
    bg: '#DCE8FF',
    text: 'Amaka K. replied to your question',
    time: 'Yesterday',
    targetScreen: 'community',
    unread: false
  },
  {
    id: 'notif-4',
    icon: '📝',
    bg: '#EADFFF',
    text: 'Quiz: AI Algorithms opens Oct 12',
    time: '2 days ago',
    targetScreen: 'quizzes',
    unread: false
  },
  {
    id: 'notif-5',
    icon: '🚧',
    bg: 'var(--tile)',
    text: 'New project unlocked: Temperature Alarm',
    time: '3 days ago',
    targetScreen: 'projects',
    unread: false
  }
];

/**
 * Computes updated learner stats when XP is awarded for a classroom activity.
 *
 * @param {Object} prevStats
 * @param {Object} event
 * @param {number} event.amount - XP amount earned
 * @param {string} [event.category] - 'Courses' | 'Quizzes' | 'Labs' | 'Projects' | 'Practice'
 * @param {boolean} [event.isProblem] - Whether this counts toward the 2-problem daily streak
 * @returns {Object} Next learnerStats object
 */
export function computeNextLearnerStats(prevStats, { amount = 10, category = 'Practice', isProblem = true } = {}) {
  const nextXp = prevStats.xp + amount;
  const nextProblems = isProblem ? prevStats.dailyProblemsSolved + 1 : prevStats.dailyProblemsSolved;
  const unlockedStreakToday = prevStats.dailyProblemsSolved < 2 && nextProblems >= 2;
  const nextStreak = unlockedStreakToday ? prevStats.streakDays + 1 : prevStats.streakDays;
  const nextLevel = Math.max(7, 7 + Math.floor((nextXp - 1250) / 300));
  const nextLabs = category === 'Labs' ? prevStats.labsCompleted + 1 : prevStats.labsCompleted;
  const nextAch = nextXp >= 1400 && prevStats.achievementsCount === 24 ? 25 : prevStats.achievementsCount;

  return {
    ...prevStats,
    xp: nextXp,
    level: nextLevel,
    labsCompleted: nextLabs,
    streakDays: nextStreak,
    dailyProblemsSolved: nextProblems,
    achievementsCount: nextAch
  };
}

/**
 * Formats a new activity item for the Recent Activity feed (#dash and #activity).
 *
 * @param {string} title
 * @param {string} category
 * @returns {Object} ActivityFeedItem
 */
export function createActivityFeedItem(title, category = 'Practice') {
  const iconMap = {
    Labs: { icon: '🧪', bg: '#DDF5E3' },
    Quizzes: { icon: '💡', bg: '#EADFFF' },
    Courses: { icon: '📘', bg: '#DCE8FF' },
    Projects: { icon: '🛠️', bg: '#D2F5FB' },
    Achievements: { icon: '🏆', bg: '#FFF0C7' }
  };
  const badge = iconMap[category] || { icon: '✅', bg: '#DDF5E3' };
  return {
    id: 'act-' + Date.now(),
    icon: badge.icon,
    bg: badge.bg,
    title,
    category,
    time: 'Just now'
  };
}

/**
 * Records a lesson checkpoint attempt.
 * Used by: src/screens/LessonScreen.jsx
 *
 * @param {Object} attempt
 * @param {string} attempt.topicId - e.g. 'mechatronics-m2-t2.1' or 'ai-m4-t4.2'
 * @param {number} attempt.checkpointIndex - 0-based checkpoint question index
 * @param {number} attempt.selectedOption - 0-based option index chosen
 * @param {boolean} attempt.isCorrect - Whether the selected option matched answer index `a`
 * @returns {Promise<{ ok: boolean }>}
 */
export async function recordCheckpointAttempt(attempt) {
  // BACKEND TODO: Persist checkpoint telemetry for mastery tracking & AI tutor context
  return { ok: true, attempt };
}

/**
 * Records a completed quiz session from #quiz.
 * Used by: src/screens/QuizScreen.jsx
 *
 * @param {Object} result
 * @param {string} result.deckId - 'daily' | 'sensors' | 'pid' | 'ai' | 'circuits'
 * @param {number} result.score - Number of correct answers
 * @param {number} result.totalQuestions - Total questions in the deck
 * @param {number} result.xpEarned - XP awarded
 * @returns {Promise<{ ok: boolean }>}
 */
export async function recordQuizCompletion(result) {
  // BACKEND TODO: Persist quiz attempt and recalculate rolling quizScoreAvg
  return { ok: true, result };
}

/**
 * Syncs user accessibility and app settings.
 * Used by: src/screens/AppearanceScreen.jsx, src/screens/SettingsScreen.jsx, src/screens/LanguageScreen.jsx
 *
 * @param {Object} prefs
 * @param {'system'|'light'|'dark'} [prefs.themePref]
 * @param {number} [prefs.textSize]
 * @param {boolean} [prefs.reduceMotion]
 * @param {boolean} [prefs.lessonReminders]
 * @param {boolean} [prefs.soundEffects]
 * @param {string} [prefs.selectedLanguage]
 * @returns {Promise<{ ok: boolean }>}
 */
export async function syncUserPreferences(prefs) {
  // BACKEND TODO: Persist user preferences to user settings table
  return { ok: true, prefs };
}
