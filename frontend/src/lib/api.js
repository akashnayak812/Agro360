/**
 * Centralized API configuration for Agro360 frontend.
 * All components should import API_URL from here instead of hardcoding URLs.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Helper to build full API endpoint URLs.
 * @param {string} path - API path starting with '/' (e.g., '/api/crop/recommend')
 * @returns {string} Full URL
 */
export function apiUrl(path) {
  return `${API_URL}${path}`;
}

export default API_URL;
