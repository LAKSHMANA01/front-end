import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchDeferredTasks } from "../../redux/Slice/AdminSlice";
import AdminNavbar from "./NavBar";
import AdminTaskCard from "./AdminTaskCard";
import Loading from "../../compoents/Loadingpage"
import { fetchAllTasks } from "../../redux/Slice/AdminSlice";
const AdminDeferredTasks = () => {
  const dispatch = useDispatch();
  // const { deferredTasks, loading, error } = useSelector((state) => state.admin);
   const { tasks, loading, error } = useSelector((state) => state.admin);

  // useEffect(() => {
  //   dispatch(fetchDeferredTasks()); // Fetch deferred tasks on mount
  // }, [dispatch]);

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
    return <p className="mt-20 text-center text-gray-500">No deferred tasks available.</p>;
  }

   const filteredTasks = tasks.filter(task => {
    //console.log("task priority:",task.priority)

    const matchesStatusFilter =  task.status.toLowerCase() ===  'deferred' || task.
    engineerEmail.toLowerCase() === 'Not assigned' || task.status.toLowerCase() === "failed"
    //console.log("before priority:",task.priority)

    return matchesStatusFilter;
  });
  return (
    <div className="space-y-6 p-4">
   
      <div className="flex flex-wrap gap-6 ml-10"> 
      {filteredTasks.map((task) => (
        <AdminTaskCard key={task._id || task.id} task={task} />
      ))}
      </div>
    </div>
  );
};

export default AdminDeferredTasks;





