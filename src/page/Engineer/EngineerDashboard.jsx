import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar"; // Assuming Navbar is a top navigation bar.

const EngineerLayout = () => {
  return (
    <div className="flex flex-col h-screen">

      {/* This makes the layout take full screen */}
      {/* Top Navbar */}
      <Navbar />
      <div className="flex flex-1 ">
        {" "}
        {/* Flex container for sidebar and content */}
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content Area */}
        <div className="flex-1 mt-10 ml-10 md:ml-20 transition-all duration-300 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-6">
          {/* Child routes will be rendered here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EngineerLayout;
