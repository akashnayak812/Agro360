/**
 * Utility to track user searches
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
