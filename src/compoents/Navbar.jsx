import React, { useState } from "react";
import { Bell, Search, Sun, Moon, Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Notifications from "./notification";

const EngineerNavbar = ({
  onToggleTheme,
  isDarkMode = false,
  userName = "John Doe",
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isClick, SetClicked] = useState('');
  const { tasks, profiledata, updateProfile, error } = useSelector(
    (state) => state.engineer
  );
  //  console.log( "Engineer", profiledata)
  //  console.log( "Engineerupdatedat", updateProfile)
  const { notifications } = (useSelector = (state) => state.notifications);
  const notificationCount = notifications.filter(
    (notifications) => notifications.isRead === false
  ).length;

  return (
    <nav className="h-16 bg-white mb-10 rounded-md dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      {/* Left side - Mobile menu */}
      <h1
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
              bg-clip-text text-transparent hidden sm:block md:block"
      >
        Telecom Services
      </h1>
      <div className="flex items-center space-x-4">
        <button className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          <Menu size={24} />
        </button>
      </div>

      {/* Middle - Search Bar */}

      {/* Right side - Notifications, Theme Toggle, Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          onClick={() => SetClicked(true)}
        >
          <Bell size={24} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              {notificationCount}
            </span>
          )}
        </button>
        <Link to="/logout">
          <LogOut />
        </Link>

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
            <p className="text-sm font-medium dark:text-white">
              {profiledata?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Engineer</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
        </div>
      </div>
    </nav>
  );
};

export default EngineerNavbar;
