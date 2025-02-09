import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../../redux/Slice/AdminSlice";
import AdminTaskCard from "./AdminTaskCard";
import AdminNavbar from "./NavBar";
import Loading from "../../compoents/Loadingpage"

const AdminTaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.admin);
  


  useEffect(() => {
    dispatch(fetchAllTasks()); // Fetch all tasks on mount
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-gray-500"><Loading/></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-gray-500">No tasks available.</p>;
  }

  return (
    <div className="space-y-6 p-4 ">

        < AdminNavbar/>
     
        <div className="flex flex-wrap gap-6"> 
      {tasks.map((task) => (
       
        <AdminTaskCard  key={task._id || task.id} task={task} />
       
      ))}
     </div>
    </div>
  );
};

export default AdminTaskList;
