import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users,
  Wrench,
  ClipboardList,
  Settings,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  UserCog,
  LogOut
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlinePendingActions } from 'react-icons/md';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the state from local storage when the component mounts
  useEffect(() => {
    const savedState = localStorage.getItem('isAdminSidebarExpanded');
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState));
    }
  }, []);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/tasks', icon: ClipboardList, label: 'Tasks' },
    { path: '/admin/engineers', icon: Wrench, label: 'Engineers' },
    { path: '/admin/engineer-approval', icon: UserCog, label: 'EngineersApproval' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/hazards', icon:AlertTriangle, label: 'Hazards' },
    { path: '/admin/deferred', icon:MdOutlinePendingActions, label: 'Deferred Tasks' }
  ];

  // Determine active menu item
  const isActive = (path) => location.pathname === path;
  const handleNavigation = (path) => navigate(path);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('isAdminSidebarExpanded', JSON.stringify(newState));
  };

  return (
    <aside 
      className={`
        fixed top-16 left-0 
        z-50
   
        h-[calc(100vh-4rem)] 
        bg-white 
        border-r border-gray-300 
        shadow-xl 
        flex flex-col 
        transition-all duration-300 ease-in-out 
        ${isExpanded 
          ? 'w-64 translate-x-0' 
          : 'w-20 md:translate-x-0 -translate-x-full'
        }
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-blue-500 text-white 
          rounded-full p-2 hover:bg-blue-600 transition-colors 
          shadow-lg"
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center h-16 border-b border-gray-300 ">
        {isExpanded ? (
          <h1 className="text-2xl font-bold text-blue-600">
            Admin Panel
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-blue-500">A</h1>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center px-4 py-3 w-full rounded-lg 
                  transition-all duration-200
                  ${active 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                  }
                  group
                `}
              >
                <item.icon 
                  size={24} 
                  className={`
                    ${active ? 'text-white' : 'text-gray-700'} 
                    ${!isExpanded ? 'ml-[-4px]' : ''} 
                    group-hover:scale-110 transition-transform duration-200
                  `}
                />
                {/* Show label only on larger screens */}
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
      <div className="border-t border-gray-300 p-4">
        <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;