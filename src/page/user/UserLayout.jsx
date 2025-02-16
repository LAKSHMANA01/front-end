import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeContextProvider from '../../ContextAPI/ContextAPI';
import Navbar from './Navbar';

const AdminLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Handle scroll event
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bodyBackgroundStyle = scrollY > 100 ? 'bg-blue-100' : 'bg-white';

  return (
    <ThemeContextProvider>
      <div className="flex flex-col h-screen">
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <div className="flex flex-1 mt-16 relative">
          {/* Fixed Sidebar */}
          <Sidebar 
            isExpanded={isSidebarExpanded} 
            setIsExpanded={setIsSidebarExpanded} 
          />

          {/* Scrollable Content Area */}
          <div
            className={`
              flex-1 overflow-y-auto p-4 transition-all duration-300
              ${bodyBackgroundStyle} dark:bg-gray-900
              ${isSidebarExpanded ? 'ml-[50px]' : 'ml-[20px]'}  /* Adjust these values to match your Sidebar widths */
              md:ml-10 /* On medium/small screens, remove the margin to overlay content */
            `}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeContextProvider>
  );
};

export default AdminLayout;
