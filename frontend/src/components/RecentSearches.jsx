import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

const RecentSearches = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSearches = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/recent-searches`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearches(data.recent_searches || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearches = async () => {
    if (!confirm('Are you sure you want to clear all recent searches?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/recent-searches`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSearches([]);
      }
    } catch (error) {
      console.error('Failed to clear searches:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSearches();
    }
  }, [token]);

  const getSearchTypeIcon = (type) => {
    const icons = {
      crop: '🌾',
      disease: '🦠',
      fertilizer: '🧪',
      soil: '🌍',
      yield: '📊'
    };
    return icons[type] || '🔍';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            {t('recentSearches') || 'Recent Searches'}
          </h2>
          {searches.length > 0 && (
            <Button onClick={clearSearches} variant="outline" size="sm">
              {t('clearAll') || 'Clear All'}
            </Button>
          )}
        </div>

        {searches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t('noRecentSearches') || 'No recent searches yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((search, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl mr-3">{getSearchTypeIcon(search.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-green-700 capitalize">
                      {search.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(search.timestamp)}
                    </span>
                  </div>
                  {search.query && (
                    <div className="text-sm text-gray-700">
                      <strong>Query:</strong>
                      <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                        {typeof search.query === 'object' ? (
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(search.query, null, 2)}
                          </pre>
                        ) : (
                          <span>{search.query}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {search.result && (
                    <div className="text-sm text-gray-600 mt-2">
                      <strong>Result:</strong> {search.result}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecentSearches;
