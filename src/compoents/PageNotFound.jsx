import React, { useState, useEffect } from 'react';
import { HomeIcon, ArrowLeft, RefreshCcw, Search } from 'lucide-react';

const PageNotFound = () => {
  const [countdown, setCountdown] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Animated 404 Header */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-200 animate-pulse">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-medium text-gray-800">
              Oops! Page Not Found
            </span>
          </div>
        </div>

        {/* Astronaut Illustration */}
        <div className="relative h-48">
          <img 
            src="/api/placeholder/200/200"
            alt="Lost in Space"
            className={`mx-auto h-full object-contain ${
              isAnimating ? 'animate-bounce' : ''
            }`}
          />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <p className="text-lg text-gray-600">
            The page you're looking for has floated away into space...
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to home in {countdown} seconds
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full shadow-md hover:shadow-lg hover:bg-blue-600 transition-all"
          >
            <HomeIcon className="w-4 h-4" />
            Home Page
          </button>
          
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-gray-900"
          >
            <RefreshCcw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Popular Pages
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Dashboard', 'Profile', 'Settings', 'Help Center'].map((link) => (
              <a
                key={link}
                href={`/${link.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;