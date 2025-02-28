import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

import Navbar from './Navbar';



const AdminLayout = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Handle scroll event
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const bodyBackgroundStyle = scrollY > 100 ? 'bg-blue-white' : 'bg-white';

  return (
 
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
           className="flex-1 mt-10 ml-10 md:ml-10 transition-all duration-300 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-6"
          > 
            <Outlet />
          </div>
        </div>
      </div>

  );
};

export default AdminLayout;
//mt-10 ml-50 md:ml-20 transition-all duration-300 change width transition here transition