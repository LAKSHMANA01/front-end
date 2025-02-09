import React, { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';

const TaskSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchSearchResults();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/tasks/search?query=${searchQuery}&status=${statusFilter}`);
      if (!response.ok) throw new Error('Failed to fetch results');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch search results');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Container */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Search Header */}
        <h2 className="text-xl font-semibold mb-4">Search Tasks</h2>
        
        {/* Search and Filter Controls */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {loading && (
              <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-blue-500" />
            )}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'open', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full capitalize ${
                  statusFilter === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-6">
          {error && (
            <div className="text-red-500 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Results Stats */}
          {!error && results.length > 0 && (
            <div className="text-sm text-gray-500 mb-4">
              Found {results.length} results
            </div>
          )}

          {/* Results List */}
          <div className="space-y-4">
            {results.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                {task.assignee && (
                  <div className="mt-2 text-sm text-gray-500">
                    Assigned to: {task.assignee}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results State */}
          {!loading && !error && searchQuery && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks found matching your search
            </div>
          )}

          {/* Initial State */}
          {!loading && !error && !searchQuery && (
            <div className="text-center py-8 text-gray-500">
              Start typing to search for tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for status styling
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'open':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default TaskSearch;