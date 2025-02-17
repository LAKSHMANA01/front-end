import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import AdminNavbar from "./NavBar";
import Footer from "../../compoents/footers";
// import ThemeContextProvider from "../../ContextAPI/ContextAPI";

const AdminLayout = () => {
  return (
    // <ThemeContextProvider>
      <div className="relative">
        <AdminNavbar />
        {/* Sidebar is fixed and should be placed below the navbar */}
        <AdminSidebar />
        {/* Main content area: add top margin to offset fixed navbar */}
        <div className="mt-10 ml-300 md:ml-20 transition-all duration-300">
          <Outlet />
        </div>
        {/* <Footer/> */}
      </div>
  
  );
};

export default AdminLayout;
