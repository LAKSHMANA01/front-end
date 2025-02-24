import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import AdminNavbar from "./../../compoents/Navbar";
import Footer from "../../compoents/footers";


const AdminLayout = () => {
  return (
    // <ThemeContextProvider>
      <div className="relative">
        <AdminNavbar />
        {/* Sidebar is fixed and should be placed below the navbar */}
        <AdminSidebar />
        {/* Main content area: add top margin to offset fixed navbar */}
        <div className="mt-7 lg:ml-20 ms:ml-0 transition-all duration-300">
          <Outlet />
        </div>
        {/* <Footer/> */}
      </div>
  
  );
};

export default AdminLayout;
