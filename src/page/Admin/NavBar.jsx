import React, { useState } from "react";
import { Bell, Search, Sun, Moon, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import AdminSearch from "./AdminSearch";

const AdminNavbar = ({ onToggleTheme, isDarkMode = false, userName = "Admin", onSearch, onFilterChange }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 justify-end bg-white border-b border-gray-300 px-4 flex items-center z-50">
      {/* Left side - Logout, Theme Toggle, Profile */}
      <div className="flex items-center space-x-4">
        <Link to="/logout">
          <LogOut className="text-gray-700 hover:text-blue-500 transition-colors" />
        </Link>

        <button
          onClick={onToggleTheme}
          className="p-2 text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500"></div>
        </div>
      </div>

      {/* (Optional) If you still want a search bar on the right side, you could add another container here */}
      {/* <div className="flex-grow flex justify-end">
        <div className={`relative ${isSearchOpen ? "block" : "hidden md:block"}`}>
          <AdminSearch onSearch={onSearch} onFilterChange={onFilterChange} />
        </div>
      </div> */}
    </nav>
  );
};

export default AdminNavbar;
