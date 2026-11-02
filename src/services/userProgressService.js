/**
 * User Progress, Telemetry, Gamification & Preferences Service Layer
 * Connected to FastAPI + PostgreSQL backend.
 */
import { safeFetch } from './apiConfig.js';

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

export async function fetchDashboardTelemetry() {
  const data = await safeFetch('/user/dashboard');
  if (data && data.learnerStats) {
    return {
      learnerStats: data.learnerStats,
      activityFeed: data.activityFeed || INITIAL_ACTIVITY_FEED,
      unreadNotifications: Boolean(data.unreadNotifications)
    };
  }
  return {
    learnerStats: INITIAL_LEARNER_STATS,
    activityFeed: INITIAL_ACTIVITY_FEED,
    unreadNotifications: true
  };
}

export function computeNextLearnerStats(prevStats, { amount = 10, category = 'Practice', isProblem = true } = {}) {
  const nextXp = prevStats.xp + amount;
  const nextProblems = isProblem ? prevStats.dailyProblemsSolved + 1 : prevStats.dailyProblemsSolved;
  const unlockedStreakToday = prevStats.dailyProblemsSolved < 2 && nextProblems >= 2;
  const nextStreak = unlockedStreakToday ? prevStats.streakDays + 1 : prevStats.streakDays;
  const nextLevel = Math.max(7, 7 + Math.floor((nextXp - 1250) / 300));
  const nextLabs = category === 'Labs' ? prevStats.labsCompleted + 1 : prevStats.labsCompleted;
  const nextAch = nextXp >= 1400 && prevStats.achievementsCount === 24 ? 25 : prevStats.achievementsCount;

  // Background sync to backend
  safeFetch('/user/xp', {
    method: 'POST',
    body: JSON.stringify({
      amount,
      activityTitle: `Activity in ${category}`,
      category,
      isProblem
    })
  });

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

export async function recordCheckpointAttempt(attempt) {
  await safeFetch('/classroom/checkpoint', {
    method: 'POST',
    body: JSON.stringify(attempt)
  });
  return { ok: true, attempt };
}

export async function recordQuizCompletion(result) {
  await safeFetch('/classroom/quiz', {
    method: 'POST',
    body: JSON.stringify(result)
  });
  return { ok: true, result };
}

export async function syncUserPreferences(prefs) {
  await safeFetch('/user/preferences', {
    method: 'POST',
    body: JSON.stringify(prefs)
  });
  return { ok: true, prefs };
}
