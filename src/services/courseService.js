// Course & Pathway Service Layer for AI Mech Lab Interactive Classroom
// Currently serves verbatim extracted course content from local structured JSON and localStorage.
// Designed so a backend developer can swap these functions to backend API calls without modifying React components.

import coursesData from '../data/coursesData.json';

const PROGRESS_STORAGE_KEY = 'mlCourseProgress_v1';
const CUSTOM_TRACKS_STORAGE_KEY = 'mlCustomTracks_v1';

/**
 * Returns the full dictionary of courses from coursesData.json (`ai`, `mechatronics`).
 * @returns {Object}
 */
export function getAllCourses() {
  return coursesData.courses;
}

/**
 * Returns a single course object by slug (`'ai'` or `'mechatronics'`).
 * @param {string} courseSlug
 * @returns {Object|null}
 */
export function getCourseBySlug(courseSlug) {
  return coursesData.courses[courseSlug] || null;
}

/**
 * Returns a single PDF topic object by its unique ID (`'ai-m1-t1.1'`, `'mechatronics-m2-t2.1'`, etc.).
 * @param {string} topicId
 * @returns {Object|null}
 */
export function getTopicById(topicId) {
  return coursesData.topicsById[topicId] || null;
}

/**
 * Resolves a topic by courseSlug (`'ai' | 'mechatronics'`) and topicSlug (`'m1-t1.1'`).
 * @param {string} courseSlug
 * @param {string} topicSlug
 * @returns {Object|null}
 */
export function getTopicByCourseAndSlug(courseSlug, topicSlug) {
  const id = `${courseSlug}-${topicSlug}`;
  return coursesData.topicsById[id] || null;
}

/**
 * Returns all 11 topics for a course in sequential curriculum order.
 * @param {string} courseSlug
 * @returns {Array<Object>}
 */
export function getCourseTopicsOrdered(courseSlug) {
  const course = coursesData.courses[courseSlug];
  if (!course) return [];
  const list = [];
  course.modules.forEach((mod) => {
    mod.topics.forEach((t) => list.push(t));
  });
  return list;
}

/**
 * Retrieves saved track progress map `{ [trackKey]: completedCount }`.
 * BACKEND TODO: Replace or hydrate from user track progress table.
 * @returns {Object<string, number>}
 */
export function getSavedProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persists completion of a course lesson or project build station.
 * BACKEND TODO: Sync `{ trackKey: courseKey, completedSteps: stepIndex + 1 }` to backend.
 *
 * @param {string} courseKey - Track key (e.g. 'ai', 'mechatronics', 'robotics', 'obstacle')
 * @param {number} stepIndex - 0-based index of the completed lesson or project station
 * @returns {Object<string, number>} Updated progress map
 */
export function saveTopicCompletion(courseKey, stepIndex) {
  try {
    const cur = getSavedProgress();
    const prev = cur[courseKey] || 0;
    if (stepIndex + 1 > prev) {
      cur[courseKey] = stepIndex + 1;
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cur));
    }
    return cur;
  } catch {
    return {};
  }
}

/**
 * Persists a user-generated custom MechTrack (`course` or `project`).
 * BACKEND TODO: Persist custom track definition to user's saved tracks.
 *
 * @param {string} trackKey
 * @param {Object} trackData - `{ k: 'course'|'project', t: string, s: string[], a: number, m: [string, number], f: [string, string] }`
 */
export function saveCustomTrack(trackKey, trackData) {
  try {
    const raw = localStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[trackKey] = trackData;
    localStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(map));
    return map;
  } catch {
    return {};
  }
}

/**
 * Retrieves user-generated custom MechTracks from local storage.
 * @returns {Object}
 */
export function getSavedCustomTracks() {
  try {
    const raw = localStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
