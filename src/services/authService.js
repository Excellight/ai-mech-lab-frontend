/**
 * Authentication & Account Service Layer for AI Mech Lab
 *
 * Connected to FastAPI + PostgreSQL backend with seamless local cache fallback.
 */
import { safeFetch } from './apiConfig.js';

const SESSION_STORAGE_KEY = 'mlUserSession_v1';

export const DEFAULT_DEMO_USER = {
  id: 'usr-mech-learner',
  username: 'mechlearner',
  displayName: 'Mech Learner',
  avatarInitials: 'ML',
  firstName: 'Mech',
  middleName: '',
  lastName: 'Learner',
  phoneOrEmail: 'learner@aimechlab.local',
  country: 'Nigeria',
  city: 'Lagos',
  fieldOfStudy: 'Mechatronics',
  gender: 'Prefer not to say',
  dob: '',
  authenticated: true,
  authProvider: 'demo'
};

export function getCurrentSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_DEMO_USER, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
  return DEFAULT_DEMO_USER;
}

export async function loginWithCredentials({ identifier, password } = {}) {
  const trimmedId = (identifier || '').trim();

  // Call FastAPI backend
  const res = await safeFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: trimmedId, password })
  });

  if (res && res.ok && res.user) {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(res.user));
    } catch {}
    return { ok: true, user: res.user };
  }

  // Graceful fallback
  const user = {
    ...getCurrentSessionUser(),
    username: trimmedId || DEFAULT_DEMO_USER.username,
    displayName: trimmedId || DEFAULT_DEMO_USER.displayName,
    authenticated: true,
    authProvider: 'credentials'
  };
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch {}
  return { ok: true, user };
}

export async function loginWithOAuth(provider) {
  const user = {
    ...getCurrentSessionUser(),
    authenticated: true,
    authProvider: provider || 'oauth'
  };
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch {}
  return { ok: true, user };
}

export async function registerUser(payload = {}) {
  // Call FastAPI backend
  const res = await safeFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res && res.ok && res.user) {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(res.user));
    } catch {}
    return { ok: true, user: res.user };
  } else if (res && !res.ok) {
    return res;
  }

  // Fallback
  const firstName = (payload.firstName || '').trim();
  const lastName = (payload.lastName || '').trim();
  const initials = `${firstName[0] || 'M'}${lastName[0] || 'L'}`.toUpperCase();

  const user = {
    id: 'usr-' + Date.now(),
    username: (payload.username || '').trim() || 'mechlearner',
    displayName: `${firstName} ${lastName}`.trim() || 'Mech Learner',
    avatarInitials: initials,
    firstName,
    middleName: (payload.middleName || '').trim(),
    lastName,
    country: payload.country || '',
    city: payload.city || '',
    phoneOrEmail: (payload.phoneOrEmail || '').trim(),
    fieldOfStudy: payload.fieldOfStudy || '',
    gender: payload.gender || '',
    dob: payload.dob || '',
    authenticated: true,
    authProvider: 'signup'
  };

  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch {}
  return { ok: true, user };
}

export async function logoutUser() {
  await safeFetch('/auth/logout', { method: 'POST' });
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
  return { ok: true };
}
