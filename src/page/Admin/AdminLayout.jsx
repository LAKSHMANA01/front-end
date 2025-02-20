// src/components/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeContextProvider from '../../ContextAPI/ContextAPI';

import Dashbord from '../../compoents/Dashbord';

const AdminLayout = () => {
  return (
    <ThemeContextProvider>
      
        <Sidebar />
      <div className="flex">
       
        <div className="grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        {/* {window.location.pathname !== "/admin/Tickets" && <Navbar />}
        {window.location.pathname !== "/admin/Tickets" && <Dashbord />} */}
          {/* here router parence to child router display */}
          <Outlet />
        </div>
      </div>
    </ThemeContextProvider>
  );
};

export default AdminLayout;