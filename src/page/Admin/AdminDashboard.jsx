






import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "../../compoents/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import AdminTaskList from "./AdminTaskList"; // Import AdminTaskList
import AdminNavbar from "./NavBar";


function AdminDashboard() {
  const location = useLocation();
  
  return (
      <div className="flex">
        {/* Sidebar is always visible */}
        <Sidebar />
        <AdminNavbar/>
        
        <div className="grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-6">
          {/* Show Navbar only when not on /admin/tasks */}
          {location.pathname !== "/admin/tasks" && <Navbar />}

          {/* Render tasks when visiting the /admin/tasks route */}
          {location.pathname === "/admin/tasks" ? <AdminTaskList /> : <Outlet />}
        </div>
      </div>
  );
}

export default AdminDashboard;

