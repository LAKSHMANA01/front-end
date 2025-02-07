// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Navbar from './navBar';
// import Footer from './footer';
// import { useParams } from 'react-router-dom';
// import { fetchTickets } from '../redux/Slice/ticketSlice';
// import TaskCard from './TaskCard';

// const UserTicketList = () => {
//   const { userId } = useParams();
//   const dispatch = useDispatch();
//   const { tasks, loading, error } = useSelector((state) => state.tickets);

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchTickets(userId));
//     }
//   }, [userId, dispatch]);

//   if (loading) {
//     return <div>Loading tickets...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       {/* <Navbar /> */}
//       <div style={taskListStyles}>
//         {tasks.map((task) => (
//           <TaskCard key={task._id} task={task} showPriority={false} />
//         ))}
//       </div>
//       {/* <Footer /> */}
//     </div>
//   );
// };

// const taskListStyles = {
//   display: 'flex',
//   flexWrap: 'wrap',
//   justifyContent: 'center',
//   gap: '20px',
//   padding: '2rem',
// };

// export default UserTicketList;
