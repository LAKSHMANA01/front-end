// // // Example usage in a parent component:
// // import React from 'react';
// // import Dashboard from "./../../compoents/Dashbord"


// // const UserDashboard = () => {


// //   // const metrics = {
// //   //   activeEngineers: 140,
// //   //   activeEngineersTrend: 5,
// //   //   activeEngineersStatus: 'success',
// //   //   completedTasks: 82,
// //   //   completedTasksTrend: 12,
// //   //   completedTasksStatus: 'success',
// //   //   pendingTasks: 20,
// //   //   pendingTasksTrend: -2,
// //   //   pendingTasksStatus: 'warning',
// //   //   totalTasks: 102,
// //   //   totalTasksTrend: 8,
// //   //   totalTasksStatus: 'neutral'
// //   // };

// //   // // Sample data for charts
// //   // const taskProgress = [
// //   //   { name: 'Jan', value: 45 },
// //   //   { name: 'Feb', value: 52 },
// //   //   { name: 'Mar', value: 48 },
// //   //   { name: 'Apr', value: 61 },
// //   //   { name: 'May', value: 58 },
// //   //   { name: 'Jun', value: 65 }
// //   // ];

// //   // const teamPerformance = [
// //   //   { name: 'Team A', value: 85 },
// //   //   { name: 'Team B', value: 72 },
// //   //   { name: 'Team C', value: 91 },
// //   //   { name: 'Team D', value: 67 }
// //   // ];

// //   return (
// //     <Dashboard
// //      />
// //   );
// // };
// // export default UserDashboard;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Dashbord from "../../compoents/Dashbord";
// import apiClient from "../../utils/apiClient";

// const email = sessionStorage.getItem('email');
// const role = sessionStorage.getItem('role');

// const UserDashboard = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [cardData, setCardData] = useState({});
//   const [taskStatusData, setTaskStatusData] = useState({});
//   const [taskPriorityData, setTaskPriorityData] = useState({});

//   useEffect(() => {
//     apiClient.get(`/tickets/${role}/${email}`)
//       .then((response) => {
//         const data = response.data;
//         setCardData({
//           completedTickets: data.completedTickets,
//           pendingTickets: data.pendingTickets,
//           totalTickets: data.totalTickets
//         });
//         setTaskStatusData(data.taskStatusData);
//         setTaskPriorityData(data.taskPriorityData);
//       })
//       .catch((error) => console.error("Error fetching user data:", error))
//       .finally(() => setIsLoading(false));
//   }, []);

//   return <Dashbord role="user" isLoading={isLoading} cardData={cardData} taskStatusData={taskStatusData} taskPriorityData={taskPriorityData} />;
// };

// export default UserDashboard;

