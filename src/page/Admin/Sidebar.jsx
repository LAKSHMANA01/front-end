// src/components/Sidebar.jsx
import React from 'react';
import { FaBox, FaCog, FaShoppingCart, FaTachometerAlt, FaUser } from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-600 text-white' : '';
  };

  return (
    // if here theme change dark: sytle i add here check
    <div className="bg-gray-100 text-gray-900 h-screen px-4 fixed w-14 md:w-64 border-r border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600">
      <h1 className='text-2xl font-bold hidden md:block'>Brillio</h1>
      <ul className="flex flex-col mt-5 text-xl">
        <li className={`flex items-center py-5 px-4 space-x-4 hover:rounded hover:cursor-pointer hover:bg-blue-600 hover:text-white ${isActive('/admin')}`}>
          <FaTachometerAlt />
          <Link to="/admin" className='hidden md:inline'>Dashboard</Link>
        </li>

        <li className={`flex items-center py-5 px-4 space-x-4 hover:rounded hover:cursor-pointer hover:bg-blue-600 hover:text-white ${isActive('/admin/tasks')}`}>
          <FaShoppingCart />
          <Link to="/admin/tasks" className='hidden md:inline'>Tasks</Link>
        </li>

        <li className='flex items-center py-5 px-4 space-x-4 hover:rounded hover:cursor-pointer hover:bg-blue-600 hover:text-white'>
          <FaUser />
          <Link to="/admin/users" className='hidden md:inline'>user</Link>
        </li>
        
        <li className='flex items-center py-5 px-4 space-x-4 hover:rounded hover:cursor-pointer hover:bg-blue-600 hover:text-white'>
          <FaBox />
          <Link to="/admin/engineers" className=' md:inline'>Engineers</Link>
        </li>
        <li className='flex items-center py-5 px-4 space-x-4 hover:rounded hover:cursor-pointer hover:bg-white-900 hover:text-white'>
          <FaCog />
          <span className='hidden md:inline'>Settings</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;