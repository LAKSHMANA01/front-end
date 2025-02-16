import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users,
  Wrench,
  ClipboardList,
  Settings,
  ChevronRight,
  ChevronLeft,
  UserCog,
  LogOut
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location (path)

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/tasks', icon: ClipboardList, label: 'Tasks' },
    { path: '/admin/engineers', icon: Wrench, label: 'Engineers' },
    { path: '/admin/engineer-approval',icon:UserCog,  label: 'EngineersApproval'},
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  // Check if the current location is the same as the menu item's path
  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 z-40
        h-screen
        bg-gray-900 
        transition-all duration-300 ease-in-out
        border-r border-gray-800
        ${isExpanded ? 'w-64' : 'w-20'}
        shadow-xl
        flex flex-col
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-8 bg-purple-600 text-white
          rounded-full p-1 hover:bg-purple-700 transition-colors
          shadow-lg md:block"
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center h-16 border-b border-gray-800">
        {isExpanded ? (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 
            bg-clip-text text-transparent">
            Admin Panel
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-purple-500">A</h1>
        )}
      </div>

      {/* Menu Items - Scrollable Section */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center px-4 py-3 w-full
                  rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                  }
                  group
                `}
              >
                <item.icon 
                  size={24} 
                  className={`
                    ${active ? 'text-white' : 'text-gray-400'}
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
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4">
        <div className={`
          flex items-center
          ${isExpanded ? 'justify-between' : 'justify-center'}
        `}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <UserCog size={20} className="text-white" />
            </div>
            {isExpanded && (
              <div>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <LogOut className="inline-block mr-2" size={16} />
                  <span className="text-sm">Logout</span>
                </Link>
                <p className="text-sm font-medium text-white">Admin Name</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
