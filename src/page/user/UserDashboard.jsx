import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { fetchTickets } from '../../redux/Slice/UserSlice';
import { setUser } from '../../redux/Slice/authSlice';
import TaskCard from './Taskcard';
import Loading from "../../compoents/Loadingpage"


const email = sessionStorage.getItem('email');
const role = sessionStorage.getItem('role');
const UserTicketList = () => {
  //const  userId  = 2
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  //console.log("User:",user);
  const { tasks, loading, error } = useSelector((state) => state.tickets);
  
  useEffect(() => {
    
    if (user?.email && user?.role && !isDataLoaded)  {
      dispatch(fetchTickets({userEmail: user.email, role: user.role}));
      setIsDataLoaded(true)
    }
  }, [user, dispatch,isDataLoaded]);

  if (!user?.email || !user?.role) {
    return <div>Loading user data...</div>;
  }

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
