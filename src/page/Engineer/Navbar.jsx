import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon,
  Menu,
  LogOut
} from "lucide-react";
import { Link } from 'react-router-dom';

const EngineerNavbar = ({ onToggleTheme, isDarkMode = false, userName = "John Doe" }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="h-16 bg-white mb-10 rounded-md dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between">
      {/* Left side - Mobile menu and Search */}
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          <Menu size={24} />
        </button>
        
        <div className={`
          relative flex items-center
          ${isSearchOpen ? 'w-full md:w-96' : 'w-auto'}
        `}>
          <div className={`
            flex items-center w-full
            ${isSearchOpen ? 'block' : 'hidden md:flex'}
          `}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 pr-4 
                  rounded-lg border border-gray-200 
                  dark:border-gray-700 dark:bg-gray-800 
                  focus:outline-none focus:border-blue-500
                  dark:text-gray-300"
              />
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 
                  text-gray-400 dark:text-gray-500"
              />
            </div>
          </div>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden ml-2 text-gray-600 dark:text-gray-300"
          >
            <Search size={24} />
          </button>
        </div>
      </div>

      {/* Right side - Notifications, Theme Toggle, Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        {/* <button className="relative p-2 text-gray-600 dark:text-gray-300 
          hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}
         <Link to="/logout"><LogOut/></Link>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-gray-600 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Profile Section */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium dark:text-white">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Engineer</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
        </div>
      </div>
    </nav>
  );
};

export default EngineerNavbar;