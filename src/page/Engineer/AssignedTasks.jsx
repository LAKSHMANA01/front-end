import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { fetchEngineerTasks } from '../../redux/Slice/engineerTaskSlice';
import TaskCard from './TaskCard';
import Loading from "../../compoents/Loadingpage"

const EngineerTaskList = () => { 
  
  const  engineerId  = 3; // Get engineerId from URL
  console.log("urserId for user")
  const dispatch = useDispatch();

  // Access tasks, loading, and error state from Redux store
  const { tasks, loading, error } = useSelector((state) => state.engineerTasks);

  useEffect(() => {
    if (engineerId) {
      dispatch(fetchEngineerTasks(engineerId)); // Fetch tasks when engineerId is available
    }
  }, [engineerId, dispatch]);

  if (loading) {
    return <div><Loading/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} /> 
        ))}
      </div>
    </div>
  );
};

export default EngineerTaskList;
