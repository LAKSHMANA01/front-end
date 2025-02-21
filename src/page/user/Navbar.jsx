import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Menu, LogOut } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Notification from './../../compoents/notification';
import { fetchNotifications} from "./../../redux/Slice/notificationSlice"
         


const Navbar = ({ onToggleTheme, isDarkMode = false,  }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const [isClick, SetClicked] = useState('');
  const { tasks, updateProfile, loading, error } = useSelector((state) => state.tickets);
  const { profile } = useSelector((state) => state.tickets);
  const { notifications } = useSelector((state) => state.notifications);
  const notificationsCount = notifications.filter(notification => notification.isRead === false).length;

  return (
    <nav className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Left side - Mobile menu and Search */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
              bg-clip-text text-transparent hidden sm:block md:block">
              Telecom Services
        </h1>
        <button className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          <Menu size={24} />
        </button>
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
        <div>
        <button
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          onClick={() => {SetClicked(!isClick)}
            
          } 
        
        >
          <Bell size={24} />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              {notificationsCount}
            </span>
          )}
             { isClick && <Notification/>}
             
        </button>
      </div>
  
        {/* Profile Section */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium dark:text-white">{profile?.name}</p>
          </div>
          <div className="relative group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-white dark:bg-gray-800 text-center text-sm font-medium text-gray-700 dark:text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {profile?.name}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;