/**
 * Authentication & Account Service Layer for AI Mech Lab
 *
 * STATUS: Currently operates in local/demo mode so all 27 screens work out-of-the-box.
 * BACKEND INTEGRATION POINT: Replace the bodies of these functions with calls to the
 * backend authentication service (REST, GraphQL, or SDK) without modifying UI components.
 */

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

/**
 * Returns the currently persisted session user or the default demo profile.
 * @returns {Object} UserProfile
 */
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

/**
 * Authenticates a user with identifier (email, phone, or username) and password.
 * Used by: src/screens/AuthScreen.jsx
 *
 * @param {Object} credentials
 * @param {string} credentials.identifier - Email, phone number, or username
 * @param {string} credentials.password - Plaintext password over TLS
 * @returns {Promise<{ ok: boolean, user?: Object, error?: string }>}
 */
export async function loginWithCredentials({ identifier, password } = {}) {
  // BACKEND TODO: Connect to backend login operation
  const trimmedId = (identifier || '').trim();
  const user = {
    ...getCurrentSessionUser(),
    username: trimmedId || DEFAULT_DEMO_USER.username,
    displayName: trimmedId || DEFAULT_DEMO_USER.displayName,
    authenticated: true,
    authProvider: 'credentials'
  };
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
  return { ok: true, user };
}

/**
 * Initiates or completes OAuth sign-in for Google, GitHub, or LinkedIn.
 * Used by: src/screens/AuthScreen.jsx, src/screens/SignupScreen.jsx
 *
 * @param {'google' | 'github' | 'linkedin'} provider
 * @returns {Promise<{ ok: boolean, user?: Object, error?: string }>}
 */
export async function loginWithOAuth(provider) {
  // BACKEND TODO: Connect to OAuth redirect / popup flow
  const user = {
    ...getCurrentSessionUser(),
    authenticated: true,
    authProvider: provider || 'oauth'
  };
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
  return { ok: true, user };
}

/**
 * Registers a new learner account from the Sign Up form (#signup).
 * Used by: src/screens/SignupScreen.jsx
 *
 * @param {Object} payload
 * @param {string} payload.firstName - Required (#fn)
 * @param {string} [payload.middleName] - Optional (#mn)
 * @param {string} payload.lastName - Required (#ln)
 * @param {string} [payload.country] - Selected country (#cc)
 * @param {string} [payload.city] - Selected or free-text city (#cy)
 * @param {string} payload.phoneOrEmail - Required phone or email (#ph)
 * @param {string} [payload.fieldOfStudy] - Occupation / field of study (#fs)
 * @param {string} [payload.gender] - Gender selection (#gd)
 * @param {string} [payload.dob] - Date of birth ISO YYYY-MM-DD (#db)
 * @param {string} payload.username - Required username (#un)
 * @param {string} payload.password - Required password (#pw)
 * @param {boolean} payload.termsAccepted - Required terms agreement (#tc)
 * @returns {Promise<{ ok: boolean, user?: Object, fieldErrors?: Object, error?: string }>}
 */
export async function registerUser(payload = {}) {
  // BACKEND TODO: Connect to backend account creation operation
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
  } catch {
    // Ignore storage errors
  }
  return { ok: true, user };
}

/**
 * Ends the active user session.
 * Used by: src/screens/ProfileScreen.jsx, src/screens/SettingsScreen.jsx
 *
 * @returns {Promise<{ ok: boolean }>}
 */
export async function logoutUser() {
  // BACKEND TODO: Invalidate backend session / token
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  return { ok: true };
}
