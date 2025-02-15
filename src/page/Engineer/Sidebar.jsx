import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  AlertTriangle, 
  Settings,
  ChevronRight,
  ChevronLeft,
  User, 
  LogOut 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Sidebar = ({ activePath = '/' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Resize handler for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsExpanded(false);
      } else {
        setIsMobile(false);
        setIsExpanded(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/engineer', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/engineer/AssignedTasks', icon: ClipboardList, label: 'Tasks' },
    { path: '/engineer/hazards', icon: AlertTriangle, label: 'Hazards' },
    { path: '/engineer/profile', icon: User, label: 'Profile' },
    { path: '/engineer/settings', icon: Settings, label: 'Settings' }
  ];

  const isActive = (path) => activePath === path;

  return (
    <div 
      className={`
    top-0 left-0 
        h-screen
        bg-white
        transition-all duration-300 ease-in-out
        border-r border-wh
        ${isExpanded ? 'w-64' : 'w-20'}
        shadow-xl
        flex flex-col
      `}
    >
      {/* Toggle Button (Hidden on Mobile) */}
      {!isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-8 bg-blue-600 text-white
            rounded-full p-1 hover:bg-blue-700 transition-colors shadow-lg"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      )}

      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        {isExpanded ? (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
            bg-clip-text text-transparent">
            Engineer
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-blue-600">B</h1>
        )}
      </div>

      {/* Menu Items */}
      <nav className="mt-6 px-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center px-4 py-3 mb-2 w-full
                rounded-lg transition-all duration-200
                ${active 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800'
                }
                group
              `}
            >
              <item.icon 
                size={24} 
                className={`
                  ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                  group-hover:scale-110 transition-transform duration-200
                `}
              />
              {isExpanded && (
                <span className="ml-4 font-medium transition-opacity duration-200">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
        <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
            {isExpanded && (
              <div>
                <Link to="/">
                  <LogOut />
                </Link>
                <p className="text-sm font-medium dark:text-white">User Name</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Engineer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
