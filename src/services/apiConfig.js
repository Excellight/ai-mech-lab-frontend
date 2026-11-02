/**
 * API configuration for AI Mech Lab backend connection
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Safe fetch helper that falls back gracefully if backend is offline
 */
export async function safeFetch(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[MechLab API] Fetch failed for ${endpoint}:`, err.message);
    return null;
  }
}
