import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeContextProvider from '../../ContextAPI/ContextAPI';
import Navbar from "../../page/Engineer/Navbar"; // Assuming Navbar is a top navigation bar.

const AdminLayout = () => {
  return (
    <ThemeContextProvider>
      <div className="flex flex-col h-screen"> {/* This makes the layout take full screen */}
      
        {/* Top Navbar */}
        <Navbar />

        <div className="flex flex-1"> {/* Flex container for sidebar and content */}

          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-6">
            {/* Child routes will be rendered here */}
            <Outlet />
          </div>

        </div>
      </div>
    </ThemeContextProvider>
  );
};

export default AdminLayout;
