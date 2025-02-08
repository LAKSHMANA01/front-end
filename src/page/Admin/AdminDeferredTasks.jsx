import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeferredTasks } from "../../redux/Slice/AdminSlice";
import AdminNavbar from "./NavBar";
import AdminTaskCard from "./AdminTaskCard";

const AdminDeferredTasks = () => {
  const dispatch = useDispatch();
  const { deferredTasks, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDeferredTasks()); // Fetch deferred tasks on mount
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading deferred tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!deferredTasks || deferredTasks.length === 0) {
    return <p className="text-center text-gray-500">No deferred tasks available.</p>;
  }

  return (
    <div className="space-y-6 p-4">
      <AdminNavbar />
      {deferredTasks.map((task) => (
        <AdminTaskCard key={task._id || task.id} task={task} />
      ))}
    </div>
  );
};

export default AdminDeferredTasks;
