/**
 * Community Feed & Direct Messaging Service Layer
 *
 * STATUS: Currently operates with initial community posts and message threads in local state.
 * BACKEND INTEGRATION POINT: Replace these functions with backend API calls or WebSocket/SSE
 * subscriptions to support multi-user community Q&A, project showcases, and direct messaging.
 */

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 1,
    category: 'q',
    avatar: 'AK',
    author: 'Amaka K.',
    time: '2h ago',
    text: 'My line follower keeps drifting left. Any tips on tuning the P value?',
    tags: ['Robotics', 'PID'],
    meta: '💬 8 replies · 👍 14'
  },
  {
    id: 2,
    category: 's',
    avatar: 'TO',
    author: 'Tunde O.',
    time: 'Yesterday',
    text: 'Built my first obstacle-avoiding bot this weekend! 🎉',
    tags: ['Showcase', 'Arduino'],
    meta: '💬 21 replies · 👍 56'
  },
  {
    id: 3,
    category: 'q',
    avatar: 'IA',
    author: 'Ife A.',
    time: '2d ago',
    text: 'What is the cheapest microcontroller to start with?',
    tags: ['Embedded'],
    meta: '💬 5 replies · 👍 9'
  }
];

export const INITIAL_MESSAGE_THREADS = [
  {
    id: 'thr-amaka',
    name: 'Amaka K.',
    avatar: 'AK',
    preview: 'Thanks! The P value fix worked.',
    time: '10m',
    badge: '2'
  },
  {
    id: 'thr-tunde',
    name: 'Tunde O.',
    avatar: 'TO',
    preview: 'Want to team up on the maze game?',
    time: '1h',
    badge: null
  },
  {
    id: 'thr-group',
    name: 'Robotics study group',
    avatar: 'RG',
    preview: 'Next meetup is Saturday.',
    time: 'Yesterday',
    badge: null
  },
  {
    id: 'thr-bot',
    name: 'Mech Bot',
    avatar: 'MB',
    preview: 'Your weekly summary is ready.',
    time: '2d',
    badge: null
  }
];

export const INITIAL_ACTIVE_THREAD = {
  name: 'Amaka K.',
  avatar: 'AK',
  messages: [
    { role: 'b', text: 'Hey! Did the tuning tip help?' },
    { role: 'u', text: 'Yes, the robot is much steadier now.' },
    { role: 'b', text: 'Great. Send me a photo of the build later.' }
  ]
};

/**
 * Formats a newly submitted community question from #ask.
 * Used by: src/screens/AskScreen.jsx via MechLabContext.addCommunityQuestion
 *
 * @param {Object} input
 * @param {string} input.title - Question title (#qt)
 * @param {string} input.details - Question details/code (#qd)
 * @param {string[]} input.tags - Selected topic tags
 * @param {Object} [author] - Current session user
 * @returns {Object} CommunityPost
 */
export function buildCommunityPost({ title, details, tags, author } = {}) {
  const displayTitle = (title || '').trim();
  const displayDetails = (details || '').trim();
  return {
    id: Date.now(),
    category: 'q',
    avatar: author?.avatarInitials || 'ML',
    author: author?.displayName || 'Mech Learner',
    time: 'Just now',
    text: displayTitle
      ? displayDetails
        ? `${displayTitle} — ${displayDetails}`
        : displayTitle
      : displayDetails,
    tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Robotics'],
    meta: '💬 0 replies · 👍 1'
  };
}
