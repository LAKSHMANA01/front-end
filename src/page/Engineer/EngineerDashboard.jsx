// src/components/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeContextProvider from '../../ContextAPI/ContextAPI';
import Navbar from "../../compoents/Navbar";
// import Navbar from './Navbar';
// import Dashbord from '../../compoents/Dashbord';



const AdminLayout = () => {
  return (
    <ThemeContextProvider>
        {/* <Navbar/> */}
      <div className="flex"> 
       
     


        <Sidebar />
        <div className="grow  bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        {/* {window.location.pathname !== "/admin/Tickets" && <Navbar />} */}
        {/* {window.location.pathname !== "/admin/Tickets" && <Dashbord />} */}
          {/* //here router parence to child router display */}
          <Outlet />
         </div> 
     
       </div> 
    </ThemeContextProvider>
  );
};

export default AdminLayout;