import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { fetchTickets } from '../../redux/Slice/UserSlice';
import { setUser } from '../../redux/Slice/authSlice';
import TaskCard from './Taskcard';
import Loading from "../../compoents/Loadingpage"
import Footer from '../../compoents/footers';


const email = sessionStorage.getItem('email');
const role = sessionStorage.getItem('role');

const UserTicketList = () => {
  //const  userId  = 2
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  console.log("User:",user);
  const { tasks, loading, error } = useSelector((state) => state.tickets);
  
  useEffect(() => {
    
    if (user?.email && user?.role && !isDataLoaded)  {
      dispatch(fetchTickets({userEmail: user.email, role: user.role}));
      setIsDataLoaded(true)
    }
  }, [user, dispatch,isDataLoaded]);

 

  if (loading) {
    return <div><Loading/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if(tasks.length === 0) {
    return <div className=' top-24 justify-center'> No Tickets rasie yet!</div>
  }


  return (
    <div className=''> 
   
      <div style={taskListStyles}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} showPriority={false} />
        
        ))}
      </div>
      <div className="mt-40">
      <Footer />
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
