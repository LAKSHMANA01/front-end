import React, { useState } from 'react';
import { Bell, Search, Sun, Moon, Menu, LogOut } from "lucide-react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleTheme, isDarkMode = false, userName = "John Doe" }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { tasks, updateProfile, loading, error } = useSelector((state) => state.tickets);
  const { profile } = useSelector((state) => state.tickets);

  return (
    <nav className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Left side - Mobile menu and Search */}
      <div className="flex items-center space-x-4">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
            bg-clip-text text-transparent">
            Telecom Services
          </h1>
     
        <button className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          <Menu size={24} />
        </button>

        <div className={`relative flex items-center ${isSearchOpen ? 'w-full md:w-96' : 'w-auto'}`}>
          <div className={`flex items-center w-full ${isSearchOpen ? 'block' : 'hidden md:flex'}`}>
            {/* <div className="relative w-full">
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
            </div> */}
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
        <Link to="/logout"><LogOut /></Link>
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
            <p className="text-sm font-medium dark:text-white">{profile?.name}</p>
         
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
