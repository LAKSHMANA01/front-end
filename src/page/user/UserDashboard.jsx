import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { fetchTickets } from '../../redux/Slice/UserSlice';
import TaskCard from './Taskcard';
import Loading from "../../compoents/Loadingpage"



const UserTicketList = () => {
  const  userId  = 2
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tickets);

  useEffect(() => {
    console.log(`userId inside userEffect userDashboard: ${userId}`)
    if (userId) {
      dispatch(fetchTickets(userId));
    }
  }, [userId, dispatch]);



  if (loading) {
    return <div><Loading/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
   
      <div style={taskListStyles}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} showPriority={false} />
        ))}
      </div>
   
    </div>
  );
};

const taskListStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  padding: '2rem',
};

export default UserTicketList;
