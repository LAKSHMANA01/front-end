import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../redux/Slice/AdminSlice";
import AdminTaskCard from "./AdminTaskCard";
import AdminNavbar from "./NavBar";
import Loading from "../../compoents/Loadingpage";
import { Search } from "lucide-react";
import _ from "lodash"; // Import lodash

const AdminTaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // New state for debounced value
  const [statusFilter, setStatusFilter] = useState("");
  const [ priorityFilter,  SetpriorityFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAllTasks()); // Fetch all tasks on mount
  }, [dispatch]);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Update only after 500ms of inactivity
    }, 500);

    return () => clearTimeout(handler); // Cleanup on unmount or change
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center text-gray-500"><Loading/></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-gray-500">No tasks available.</p>;
  }

  // Filter tasks based on debounced search term
  const filteredTasks = tasks.filter(task => {
    console.log(task.priority)
    const matchesSearchTerm = task.serviceType.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter ? task.status.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesPriorityusFilter = priorityFilter ? task.priority.toLowerCase() === priorityFilter.toLowerCase() : true;
    return matchesSearchTerm && matchesStatusFilter && matchesPriorityusFilter;
  });

  return (
    <div className="space-y-6 p-4 mt-20">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search tasks by ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Updates instantly, but filtering is debounced
          className="w-full px-5 py-2 pl-10 pr-4 
            rounded-lg border border-gray-200 
            dark:border-gray-700 dark:bg-gray-800 
            focus:outline-none focus:border-blue-500
            dark:text-gray-300"
        />
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 
            text-gray-400 dark:text-gray-500"
        />
      </div>

      {/* Status Dropdown */}
      <div className="relative mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40 px-4 py-2 rounded-lg border border-gray-200 
            dark:border-gray-700 dark:bg-gray-800 
            focus:outline-none focus:border-blue-500
            dark:text-gray-300"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {/* Priority Dropdown */}
        <select
         value={priorityFilter}
         onChange={(e) =>  SetpriorityFilter(e.target.value)}
          className="w-40 px-4 py-2 rounded-lg border border-gray-200 
            dark:border-gray-700 dark:bg-gray-800 
            focus:outline-none focus:border-blue-500
            dark:text-gray-300 mt-8"
        >
          <option >Priority</option>
          <option value="low">low</option>
          <option value="Medium">Medium</option>
          <option value="high">High</option>
       {/* 'low', 'medium', 'high' */}
        </select>
      </div>

      {/* Task Cards */}
      <div className="flex flex-wrap gap-6 ">
        {filteredTasks.map((task) => (
          <AdminTaskCard key={task._id || task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default AdminTaskList;
