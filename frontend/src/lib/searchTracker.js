/**
 * Utility to track user searches
 */

import { API_URL } from './api';

export const trackSearch = async (token, searchType, queryParams, resultSummary) => {
  if (!token) return;

  try {
    await fetch(`${API_URL}/api/auth/recent-searches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: searchType,
        query: queryParams,
        result: resultSummary
      })
    });
  } catch (error) {
    console.error('Failed to track search:', error);
  }
};

/**
 * Search type constants
 */
export const SEARCH_TYPES = {
  CROP: 'crop',
  DISEASE: 'disease',
  FERTILIZER: 'fertilizer',
  SOIL: 'soil',
  YIELD: 'yield',
  ADVISORY: 'advisory'
};
