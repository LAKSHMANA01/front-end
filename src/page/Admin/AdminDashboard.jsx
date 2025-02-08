// import React from "react";
// import Sidebar from "../../compoents/Sidebar";
// import Navbar from "../../compoents/Navbar";
// import Dashbord from "../../compoents/Dashbord";
// import { Outlet } from "react-router-dom"; // For rendering child routes
// import ThemeContextProvider from "../../ContextAPI/ContextAPI";

// function AdminDashboard() {
//   return (
//     <ThemeContextProvider>
//       <div className="flex">
//         {/* Sidebar is always visible */}
//         <Sidebar />
        
//         {/* Conditional rendering: Check if the route is "/admin/Tickets" */}
//         <div className="grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
//           {/* Render Navbar and Dashbord for all routes except "/admin/Tickets" */}
        
          
//           {/* Render the content based on the current route */}
//           {/*  // This renders the content from the child route (like Tickets) */}
//           <Outlet />
//         </div>
//       </div>
//     </ThemeContextProvider>
//   );
// }

// export default AdminDashboard;






import React from "react";
import Sidebar from "../../compoents/Sidebar";
import Navbar from "../../compoents/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import ThemeContextProvider from "../../ContextAPI/ContextAPI";
import AdminTaskList from "../../compoents/AdminTaskList"; // Import AdminTaskList
import Navbar from './NavBar';
import AdminNavbar from "./NavBar";

function AdminDashboard() {
  const location = useLocation();
  
  return (
    <ThemeContextProvider>
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
    </ThemeContextProvider>
  );
}

export default AdminDashboard;

