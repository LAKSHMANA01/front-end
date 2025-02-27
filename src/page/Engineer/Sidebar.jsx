import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  User,

} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MdOutlinePendingActions } from 'react-icons/md';


const Sidebar = ({ activePath = "/" }) => {
  const UserName = sessionStorage.getItem("email") ;
const firstName  =  UserName?.split('@')[0];
      
  const [isExpanded, setIsExpanded] = useState(false);
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
        setIsExpanded(false); // Initially closed on larger screens as well
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    setIsExpanded(false)
  }, []);

  const menuItems = [
    { path: "/engineer", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/engineer/assignedTasks", icon: ClipboardList, label: "Tasks" },
    { path: "/engineer/hazards", icon: ShieldAlert, label: "Hazards" },
    { path: "/engineer/profile", icon: User, label: "Profile" },
    // { path: '/engineer/settings', icon: Settings, label: 'Settings' }
    { path: '/engineer/task/acceptance', icon:MdOutlinePendingActions, label: 'Task Acceptance' }
  ];

  const isActive = (path) => activePath === path;

  // Methods to open and close the sidebar
  const openSidebar = () => setIsExpanded(true);
  const closeSidebar = () => setIsExpanded(false);

  return (
    <div
      className={`
     fixed min-h-screen top-16 
     z-10
        h-[calc(100vh-4rem)] 
        bg-white
        transition-all duration-300 ease-in-out
        border-r border-wh
        ${isExpanded ? "w-64" : "w-20"}
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
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
            bg-clip-text text-transparent"
          >
            
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-blue-600"></h1>
        )}
      </div>

      {/* Search Bar (only when expanded) */}


      {/* Menu Items */}
      <nav className="mt-6 px-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() =>{ navigate(item.path) , closeSidebar()}}
              title={item.label}
              className={`
                flex items-center px-4 py-3 mb-2 w-full
                rounded-lg transition-all duration-200
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                }
                group
              `}
            >
              <item.icon
                size={24}
                className={`
                  ${active ? "text-white" : "text-gray-500 dark:text-gray-400"}
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

      
    </div>
  );
};

export default Sidebar;
