// Course & Pathway Service Layer for AI Mech Lab Interactive Classroom
// Connected to FastAPI + PostgreSQL backend with local cache fallback.

import coursesData from '../data/coursesData.json';
import { safeFetch } from './apiConfig.js';

const PROGRESS_STORAGE_KEY = 'mlCourseProgress_v1';
const CUSTOM_TRACKS_STORAGE_KEY = 'mlCustomTracks_v1';

export function getAllCourses() {
  return coursesData.courses;
}

export function getCourseBySlug(courseSlug) {
  return coursesData.courses[courseSlug] || null;
}

export function getTopicById(topicId) {
  return coursesData.topicsById[topicId] || null;
}

export function getTopicByCourseAndSlug(courseSlug, topicSlug) {
  const id = `${courseSlug}-${topicSlug}`;
  return coursesData.topicsById[id] || null;
}

export function getCourseTopicsOrdered(courseSlug) {
  const course = coursesData.courses[courseSlug];
  if (!course) return [];
  const list = [];
  course.modules.forEach((mod) => {
    mod.topics.forEach((t) => list.push(t));
  });
  return list;
}

export function getSavedProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveTopicCompletion(courseKey, stepIndex) {
  try {
    const cur = getSavedProgress();
    const prev = cur[courseKey] || 0;
    if (stepIndex + 1 > prev) {
      cur[courseKey] = stepIndex + 1;
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(cur));

      // Sync to backend
      safeFetch('/courses/completion', {
        method: 'POST',
        body: JSON.stringify({
          trackKey: courseKey,
          stepIndex,
          completedStepsCount: stepIndex + 1
        })
      });
    }
    return cur;
  } catch {
    return {};
  }
}

export function saveCustomTrack(trackKey, trackData) {
  try {
    const raw = localStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[trackKey] = trackData;
    localStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(map));

    // Sync to backend
    safeFetch('/courses/custom-tracks', {
      method: 'POST',
      body: JSON.stringify({
        trackKey,
        kind: trackData.k || 'course',
        title: trackData.t || 'Custom Track',
        stops: trackData.s || []
      })
    });

    return map;
  } catch {
    return {};
  }
}

export function getSavedCustomTracks() {
  try {
    const raw = localStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
