import React, { Children, useContext, useState } from "react";
import {
  FaBox,
  FaCog,
  FaMoon,
  FaShoppingCart,
  FaSun,
  FaTachometerAlt,
  FaUser,
  FaHome
} from "react-icons/fa";


// import { FaMoon, FaSun, FaHome } from "react-icons/fa";
import { ThemeContext } from "../ContextAPI/ContextAPI";
import { Link } from "react-router-dom";
import SearchBar from"./Searchbar";

const Navbar = () => {
  const { theme, toggleThem } = useContext(ThemeContext);
  // here above change diffent form Children to perence?
  return (
    <>
      <div className="bg-gray-200 text-gray-900 border-r border-gray-900 p-4 flex justify-between space-x-3 dark:bg-gray-900 dark:text-white dark:border-gray-600">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        
        <div className="flex text-xl gap-4">
        <Link to="/"><FaHome/></Link>
        <button className="text-xl text-dark" onClick={toggleThem}>
          {theme === "light" ? <FaSun /> : <FaMoon />}{" "}
        </button>

        </div>
      </div>
    </>
  );
};
export default Navbar;
