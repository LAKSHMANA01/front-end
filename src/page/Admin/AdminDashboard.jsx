import React from "react";
import Sidebar from "../../compoents/Sidebar";
import Navbar from "../../compoents/Navbar";
import Dashbord from "../../compoents/Dashbord";
import { Outlet } from "react-router-dom"; // For rendering child routes
import ThemeContextProvider from "../../ContextAPI/ContextAPI";

function AdminDashboard() {
  return (
    <ThemeContextProvider>
      <div className="flex">
        {/* Sidebar is always visible */}
        <Sidebar />
        
        {/* Conditional rendering: Check if the route is "/admin/Tickets" */}
        <div className="grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
          {/* Render Navbar and Dashbord for all routes except "/admin/Tickets" */}
        
          
          {/* Render the content based on the current route */}
          {/*  // This renders the content from the child route (like Tickets) */}
          <Outlet />
        </div>
      </div>
    </ThemeContextProvider>
  );
}

export default AdminDashboard;
