import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  SCREEN_ROUTES,
  PARENT_NAV_MAP,
  FOLDER_TO_SCREEN_MAP,
  INITIAL_TRACKS
} from '../data/initialData';
import {
  getAllCourses,
  getTopicByCourseAndSlug,
  getSavedProgress,
  saveTopicCompletion,
  saveCustomTrack
} from '../services/courseService';
import { planMechBotResponse } from '../services/aiAssistantService';
import {
  getCurrentSessionUser,
  loginWithCredentials as authLoginWithCredentials,
  loginWithOAuth as authLoginWithOAuth,
  registerUser as authRegisterUser,
  logoutUser as authLogoutUser
} from '../services/authService';
import {
  INITIAL_LEARNER_STATS,
  INITIAL_ACTIVITY_FEED,
  computeNextLearnerStats,
  createActivityFeedItem,
  syncUserPreferences
} from '../services/userProgressService';
import {
  INITIAL_COMMUNITY_POSTS,
  INITIAL_ACTIVE_THREAD,
  buildCommunityPost
} from '../services/communityService';

const MechLabContext = createContext(null);

export function MechLabProvider({ children }) {
  // 1. Active Screen & Routing
  const resolveHashToScreen = () => {
    const rawHash = window.location.hash.replace(/^#/, '').split('?')[0].trim();
    if (rawHash && FOLDER_TO_SCREEN_MAP[rawHash]) {
      return FOLDER_TO_SCREEN_MAP[rawHash];
    }
    const pathParts = (window.location.pathname || '').split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && FOLDER_TO_SCREEN_MAP[lastPart]) {
      return FOLDER_TO_SCREEN_MAP[lastPart];
    }
    return 'auth';
  };

  const resolveHashLessonState = () => {
    const hashStr = window.location.hash || '';
    const qIdx = hashStr.indexOf('?');
    if (qIdx !== -1) {
      const params = new URLSearchParams(hashStr.slice(qIdx + 1));
      const cKey = params.get('course');
      const sIdx = parseInt(params.get('step'), 10);
      if (cKey && INITIAL_TRACKS[cKey] && !Number.isNaN(sIdx)) {
        return {
          courseKey: cKey,
          stepIndex: Math.max(0, Math.min(sIdx, INITIAL_TRACKS[cKey].s.length - 1))
        };
      }
    }
    return {
      courseKey: 'robotics',
      stepIndex: 3
    };
  };

  const [currentScreen, setCurrentScreen] = useState(resolveHashToScreen);
  const [screenMenuOpen, setScreenMenuOpen] = useState(false);

  // Authenticated / Session User State
  const [currentUser, setCurrentUser] = useState(getCurrentSessionUser);

  // 2. Theme, Text Size, and Reduced Motion
  const [themePref, setThemePref] = useState(() => {
    try {
      return localStorage.getItem('mlTheme') || 'system';
    } catch {
      return 'system';
    }
  });
  const [isDark, setIsDark] = useState(false);
  const [textSize, setTextSizeState] = useState(16);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lessonReminders, setLessonReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // 3. Tracks, Courses, Projects, and Active Lesson State
  const [tracks, setTracks] = useState(() => {
    const saved = getSavedProgress();
    const copy = JSON.parse(JSON.stringify(INITIAL_TRACKS));
    Object.keys(saved).forEach((k) => {
      if (copy[k] && typeof saved[k] === 'number') {
        copy[k].a = Math.min(saved[k], copy[k].s.length);
        if (copy[k].a < copy[k].s.length) {
          copy[k].m = [copy[k].s[copy[k].a], copy[k].m ? copy[k].m[1] : 25];
        }
      }
    });
    return copy;
  });

  const [customCourses, setCustomCourses] = useState([]);
  const [customProjects, setCustomProjects] = useState([]);
  const [activeTrackKeys, setActiveTrackKeys] = useState({
    course: 'drone',
    project: 'obstacle'
  });

  // Active lesson state: tracks which course key and which step index is open in #lesson
  const [activeLessonState, setActiveLessonState] = useState(resolveHashLessonState);

  // Phase 1 & 2: Active Quiz Deck and Active Lab Bench
  const [activeQuizDeckId, setActiveQuizDeckId] = useState('daily');
  const [activeLabBench, setActiveLabBench] = useState('robotics-pid');

  // Phase 3: Socratic Hint Tier tracking per topic
  const [socraticHintTiers, setSocraticHintTiers] = useState({});

  // Phase 4: Connected Learner XP, Streak, and Activity Feed
  const [learnerStats, setLearnerStats] = useState(INITIAL_LEARNER_STATS);
  const [activityFeed, setActivityFeed] = useState(INITIAL_ACTIVITY_FEED);

  // 4. Toast Notification
  const [toastMsg, setToastMsg] = useState('');
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (!msg) return;
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
    }, 2200);
  }, []);

  // Award XP, update daily problem streak, and log activity via userProgressService
  const awardXp = useCallback((amount = 10, activityTitle = null, category = 'Practice', isProblem = true) => {
    setLearnerStats((prev) =>
      computeNextLearnerStats(prev, { amount, category, isProblem })
    );

    if (activityTitle) {
      setActivityFeed((prev) => {
        if (prev[0] && prev[0].title === activityTitle) return prev;
        return [createActivityFeedItem(activityTitle, category), ...prev];
      });
    }
  }, []);

  // 5. Notifications & Unread Dot
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  const markAllNotificationsRead = useCallback(() => {
    setUnreadNotifications(false);
  }, []);

  // 6. Experiment, Game, Thread Dynamic Context
  const [experimentMeta, setExperimentMeta] = useState({
    title: 'AI experiment',
    subtitle: 'Train a small model'
  });

  const [gameMeta, setGameMeta] = useState({
    title: 'Game',
    subtitle: 'Quick round'
  });

  const [threadMeta, setThreadMeta] = useState(INITIAL_ACTIVE_THREAD);

  const sendThreadMessage = useCallback((text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    setThreadMeta((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: 'u', text: trimmed }]
    }));
  }, []);

  // 7. Community Posts
  const [communityPosts, setCommunityPosts] = useState(INITIAL_COMMUNITY_POSTS);

  const addCommunityQuestion = useCallback((title, details, tags) => {
    if (!title && !details) return;
    setCommunityPosts((prev) => [
      buildCommunityPost({ title, details, tags, author: currentUser }),
      ...prev
    ]);
  }, [currentUser]);

  // 8. Chat / Mech Bot State
  const [chatTab, setChatTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const chatTimersRef = useRef([]);

  const clearChatTimers = () => {
    chatTimersRef.current.forEach(clearTimeout);
    chatTimersRef.current = [];
  };

  const resetChat = useCallback(() => {
    clearChatTimers();
    setChatMessages([]);
  }, []);

  // Navigation helper
  const navTo = useCallback((target) => {
    const clean = String(target || '').replace(/^#/, '');
    const mapped = FOLDER_TO_SCREEN_MAP[clean] || clean;
    const valid = SCREEN_ROUTES.includes(mapped) ? mapped : 'auth';
    if (window.location.hash !== '#' + valid) {
      window.location.hash = '#' + valid;
    } else {
      setCurrentScreen(valid);
      window.scrollTo(0, 0);
    }
    if (valid === 'chat') {
      setChatTab('chat');
    }
  }, []);

  // Authentication service actions
  const loginWithCredentials = useCallback(async (credentials) => {
    const res = await authLoginWithCredentials(credentials);
    if (res.ok && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  }, []);

  const loginWithOAuth = useCallback(async (provider) => {
    const res = await authLoginWithOAuth(provider);
    if (res.ok && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  }, []);

  const registerUser = useCallback(async (payload) => {
    const res = await authRegisterUser(payload);
    if (res.ok && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  }, []);

  const logoutUser = useCallback(async () => {
    await authLogoutUser();
    navTo('auth');
  }, [navTo]);

  // Open a specific quiz deck in #quiz
  const openQuizDeck = useCallback((deckId = 'daily') => {
    setActiveQuizDeckId(deckId || 'daily');
    navTo('quiz');
  }, [navTo]);

  // Open a specific interactive explorer bench in #lab
  const openLabBench = useCallback((topicId = 'robotics-pid') => {
    setActiveLabBench(topicId || 'robotics-pid');
    navTo('lab');
  }, [navTo]);

  // Select a course or project by key or title
  const selectTrackByTitleOrKey = useCallback((kind, titleOrKey) => {
    const trimmed = (titleOrKey || '').trim();
    let foundKey = tracks[trimmed] ? trimmed : null;
    if (!foundKey) {
      Object.keys(tracks).forEach((k) => {
        if (tracks[k].t.toLowerCase() === trimmed.toLowerCase()) {
          foundKey = k;
        }
      });
    }
    if (foundKey) {
      const targetKind = tracks[foundKey].k || kind;
      setActiveTrackKeys((prev) => ({ ...prev, [targetKind]: foundKey }));
      if (targetKind === 'course') {
        const tr = tracks[foundKey];
        const stepIdx = Math.min(tr.a, tr.s.length - 1);
        setActiveLessonState({ courseKey: foundKey, stepIndex: Math.max(0, stepIdx) });
      }
      return foundKey;
    }
    return null;
  }, [tracks]);

  const openLesson = useCallback((courseKey, stepIndex) => {
    const key = courseKey || activeTrackKeys.course || 'ai';
    const tr = tracks[key] || tracks.ai;
    const clampedIdx = typeof stepIndex === 'number'
      ? Math.max(0, Math.min(stepIndex, tr.s.length - 1))
      : Math.min(tr.a, tr.s.length - 1);
    setActiveLessonState({ courseKey: key, stepIndex: clampedIdx });
    navTo('lesson');
  }, [activeTrackKeys.course, tracks, navTo]);

  const completeAndAdvanceLesson = useCallback(() => {
    const { courseKey, stepIndex } = activeLessonState;
    const tr = tracks[courseKey];
    if (!tr) {
      navTo('course');
      return;
    }
    saveTopicCompletion(courseKey, stepIndex);
    const nextStepIndex = stepIndex + 1;

    setTracks((prev) => {
      const cur = prev[courseKey];
      if (!cur) return prev;
      const updatedA = Math.min(cur.s.length, Math.max(cur.a, stepIndex + 1));
      const nextStopTitle = cur.s[Math.min(updatedA, cur.s.length - 1)] || 'Lesson 1';
      return {
        ...prev,
        [courseKey]: {
          ...cur,
          a: updatedA,
          m: [nextStopTitle, updatedA >= cur.s.length ? 100 : Math.round((updatedA / cur.s.length) * 100)]
        }
      };
    });

    awardXp(
      25,
      `Completed ${tr.k === 'project' ? 'build step' : 'lesson'}: ${tr.s[stepIndex]}`,
      tr.k === 'project' ? 'Projects' : 'Courses',
      true
    );

    if (nextStepIndex < tr.s.length) {
      setActiveLessonState({ courseKey, stepIndex: nextStepIndex });
      showToast(`Completed! +25 XP · Unlocked: ${tr.s[nextStepIndex]}`);
      window.scrollTo(0, 0);
    } else {
      showToast(`${tr.t} complete! 🎉 +25 XP`);
      navTo(tr.k === 'project' ? 'project' : 'course');
    }
  }, [activeLessonState, tracks, navTo, showToast, awardXp]);

  // Complete a specific project station directly from the Project Track bridge
  const completeProjectStation = useCallback((projectKey, stationIdx) => {
    const tr = tracks[projectKey];
    if (!tr) return;
    saveTopicCompletion(projectKey, stationIdx);
    setTracks((prev) => {
      const cur = prev[projectKey];
      if (!cur) return prev;
      const updatedA = Math.min(cur.s.length, Math.max(cur.a, stationIdx + 1));
      const nextStopTitle = cur.s[Math.min(updatedA, cur.s.length - 1)] || 'Step 1';
      return {
        ...prev,
        [projectKey]: {
          ...cur,
          a: updatedA,
          m: [nextStopTitle, updatedA >= cur.s.length ? 100 : Math.round((updatedA / cur.s.length) * 100)]
        }
      };
    });
    awardXp(40, `Built project station: ${tr.s[stationIdx]} (${tr.t})`, 'Projects', true);
    showToast(`Station verified! +40 XP · ${tr.s[stationIdx]}`);
  }, [tracks, awardXp, showToast]);

  const createTrack = useCallback((kind, title, stops) => {
    let existingKey = null;
    Object.keys(tracks).forEach((k) => {
      if (tracks[k].t.toLowerCase() === title.toLowerCase()) existingKey = k;
    });
    if (existingKey) return existingKey;

    const newKey = 'g' + Date.now();
    const newTrack = {
      k: kind,
      t: title,
      s: stops,
      a: 0,
      m: [stops[0] || 'Lesson 1', 0],
      f: kind === 'course' ? ['Course complete', 'Badge earned'] : ['Final demo', 'Project complete']
    };
    saveCustomTrack(newKey, newTrack);
    setTracks((prev) => ({ ...prev, [newKey]: newTrack }));
    if (kind === 'course') {
      setCustomCourses((prev) => [{ key: newKey, title, stopsCount: stops.length }, ...prev]);
    } else {
      setCustomProjects((prev) => [{ key: newKey, title, stopsCount: stops.length }, ...prev]);
    }
    return newKey;
  }, [tracks]);

  // Resolve current active lesson data from coursesData.json if available
  const getCurrentLessonData = useCallback(() => {
    const { courseKey, stepIndex } = activeLessonState;
    const tr = tracks[courseKey] || tracks.ai;
    const courseSlug = tr.courseSlug || (courseKey === 'ai' ? 'ai' : courseKey === 'mechatronics' ? 'mechatronics' : null);
    let topicData = null;
    if (courseSlug && tr.topicSlugs && tr.topicSlugs[stepIndex]) {
      topicData = getTopicByCourseAndSlug(courseSlug, tr.topicSlugs[stepIndex]);
    }
    return {
      courseKey,
      track: tr,
      stepIndex,
      stopTitle: tr.s[stepIndex] || 'PID control basics',
      totalStops: tr.s.length,
      topicData,
      topicId: topicData ? topicData.topicId : 'robotics-pid'
    };
  }, [activeLessonState, tracks]);

  const sendMechBotMessage = useCallback((rawText, overrideTier = null) => {
    const text = (rawText || '').trim();
    if (!text) return;

    const lessonInfo = getCurrentLessonData();
    const currentTopicId = lessonInfo.topicId || 'robotics-pid';
    const currentTier = overrideTier || socraticHintTiers[currentTopicId] || 1;

    const plan = planMechBotResponse(
      text,
      {
        createTrack,
        selectCourse: (kind, key) => {
          setActiveTrackKeys((prev) => ({ ...prev, [kind]: key }));
        },
        selectLesson: (courseKey, stepIndex) => {
          setActiveTrackKeys((prev) => ({ ...prev, course: courseKey }));
          setActiveLessonState({ courseKey, stepIndex });
        }
      },
      {
        currentScreen,
        courseKey: lessonInfo.courseKey,
        stepIndex: lessonInfo.stepIndex,
        topicId: currentTopicId,
        socraticTier: currentTier
      }
    );

    const userMsgId = 'u-' + Date.now();
    const botMsgId = 'b-' + (Date.now() + 1);

    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'u', text },
      {
        id: botMsgId,
        role: 'b',
        typing: true,
        steps: plan.f || [],
        activeStep: 1,
        answer: plan.a,
        list: plan.list || null,
        link: plan.l || null
      }
    ]);

    const steps = plan.f || [];
    steps.slice(1).forEach((_, idx) => {
      const tId = setTimeout(() => {
        setChatMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, activeStep: idx + 2 } : m))
        );
      }, (idx + 1) * 450);
      chatTimersRef.current.push(tId);
    });

    const finalTimer = setTimeout(() => {
      if (plan.on) plan.on();
      setChatMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, typing: false } : m))
      );
    }, steps.length * 450 + 300);
    chatTimersRef.current.push(finalTimer);
  }, [createTrack, getCurrentLessonData, socraticHintTiers, currentScreen]);

  const openBotWithPrompt = useCallback((promptText, overrideTier = null) => {
    navTo('chat');
    setChatTab('chat');
    if (promptText && promptText.trim()) {
      setTimeout(() => {
        sendMechBotMessage(promptText, overrideTier);
      }, 80);
    }
  }, [navTo, sendMechBotMessage]);

  // Phase 3 helper: request escalating Socratic coaching tier (Tier 1 -> 2 -> 3)
  const requestSocraticCoaching = useCallback((topicId) => {
    const targetTopic = topicId || getCurrentLessonData().topicId || 'robotics-pid';
    const prevTier = socraticHintTiers[targetTopic] || 0;
    const nextTier = prevTier >= 3 ? 1 : prevTier + 1;
    setSocraticHintTiers((prev) => ({ ...prev, [targetTopic]: nextTier }));
    openBotWithPrompt(`Give me a Socratic hint (Tier ${nextTier}) for this concept`, nextTier);
  }, [getCurrentLessonData, socraticHintTiers, openBotWithPrompt]);

  // Listen to hashchange
  useEffect(() => {
    const onHashChange = () => {
      const next = resolveHashToScreen();
      setCurrentScreen(next);
      if ((window.location.hash || '').includes('?')) {
        setActiveLessonState(resolveHashLessonState());
      }
      if (next === 'chat') setChatTab('chat');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Sync body classes (nonav, dash, auth, chat, ctab, rm)
  useEffect(() => {
    const B = document.body;
    B.classList.toggle('nonav', ['auth', 'signup', 'lesson', 'chat'].includes(currentScreen));
    B.classList.toggle('dash', currentScreen === 'dash');
    B.classList.toggle('auth', currentScreen === 'auth' || currentScreen === 'signup');
    B.classList.toggle('chat', currentScreen === 'chat');
    B.classList.toggle('ctab', currentScreen === 'chat' && chatTab === 'chat');
    B.classList.toggle('rm', reduceMotion);
  }, [currentScreen, chatTab, reduceMotion]);

  // Sync theme on document.documentElement
  useEffect(() => {
    const DE = document.documentElement;
    if (themePref === 'system') {
      DE.removeAttribute('data-theme');
    } else {
      DE.setAttribute('data-theme', themePref);
    }
    try {
      localStorage.setItem('mlTheme', themePref);
    } catch {
      // ignore storage errors
    }
    const checkDark = () => {
      const attr = DE.getAttribute('data-theme');
      if (attr) return attr === 'dark';
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    setIsDark(checkDark());
  }, [themePref]);

  // Sync preference updates to userProgressService
  useEffect(() => {
    syncUserPreferences({
      themePref,
      textSize,
      reduceMotion,
      lessonReminders,
      soundEffects,
      selectedLanguage
    });
  }, [themePref, textSize, reduceMotion, lessonReminders, soundEffects, selectedLanguage]);

  const toggleDarkLight = useCallback(() => {
    setThemePref((prev) => {
      const DE = document.documentElement;
      const currentlyDark = DE.getAttribute('data-theme')
        ? DE.getAttribute('data-theme') === 'dark'
        : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      return currentlyDark ? 'light' : 'dark';
    });
  }, []);

  const setTextSize = useCallback((px) => {
    setTextSizeState(px);
    document.documentElement.style.fontSize = px + 'px';
  }, []);

  const activeNavTab = PARENT_NAV_MAP[currentScreen] || currentScreen;

  const value = {
    currentScreen,
    activeNavTab,
    navTo,
    screenMenuOpen,
    setScreenMenuOpen,
    currentUser,
    loginWithCredentials,
    loginWithOAuth,
    registerUser,
    logoutUser,
    themePref,
    setThemePref,
    isDark,
    toggleDarkLight,
    textSize,
    setTextSize,
    reduceMotion,
    setReduceMotion,
    lessonReminders,
    setLessonReminders,
    soundEffects,
    setSoundEffects,
    selectedLanguage,
    setSelectedLanguage,
    tracks,
    customCourses,
    customProjects,
    activeTrackKeys,
    setActiveTrackKeys,
    selectTrackByTitleOrKey,
    activeLessonState,
    setActiveLessonState,
    openLesson,
    completeAndAdvanceLesson,
    completeProjectStation,
    getCurrentLessonData,
    allCoursesData: getAllCourses(),
    activeQuizDeckId,
    setActiveQuizDeckId,
    openQuizDeck,
    activeLabBench,
    setActiveLabBench,
    openLabBench,
    socraticHintTiers,
    requestSocraticCoaching,
    learnerStats,
    activityFeed,
    awardXp,
    toastMsg,
    showToast,
    unreadNotifications,
    markAllNotificationsRead,
    experimentMeta,
    setExperimentMeta,
    gameMeta,
    setGameMeta,
    threadMeta,
    setThreadMeta,
    sendThreadMessage,
    communityPosts,
    addCommunityQuestion,
    chatTab,
    setChatTab,
    chatMessages,
    sendMechBotMessage,
    resetChat,
    openBotWithPrompt
  };

  return (
    <MechLabContext.Provider value={value}>
      {children}
    </MechLabContext.Provider>
  );
}

export function useMechLab() {
  const ctx = useContext(MechLabContext);
  if (!ctx) throw new Error('useMechLab must be used within a MechLabProvider');
  return ctx;
}
