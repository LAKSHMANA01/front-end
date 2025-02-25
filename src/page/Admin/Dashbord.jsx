// // // // Example usage in a parent component:
// // // import React from 'react';
// // // import Dashboard from "./../../compoents/Dashbord"
// // // const UserDashboard = () => {
// // //   // Sample data for metrics
// // //   const metrics = {
// // //     activeEngineers: 140,
// // //     activeEngineersTrend: 5,
// // //     activeEngineersStatus: 'success',
// // //     completedTasks: 82,
// // //     completedTasksTrend: 12,
// // //     completedTasksStatus: 'success',
// // //     pendingTasks: 20,
// // //     pendingTasksTrend: -2,
// // //     pendingTasksStatus: 'warning',
// // //     totalTasks: 102,
// // //     totalTasksTrend: 8,
// // //     totalTasksStatus: 'neutral'
// // //   };

// // //   // Sample data for charts
// // //   const taskProgress = [
// // //     { name: 'Jan', value: 45 },
// // //     { name: 'Feb', value: 52 },
// // //     { name: 'Mar', value: 48 },
// // //     { name: 'Apr', value: 61 },
// // //     { name: 'May', value: 58 },
// // //     { name: 'Jun', value: 65 }
// // //   ];

// // //   const teamPerformance = [
// // //     { name: 'Team A', value: 85 },
// // //     { name: 'Team B', value: 72 },
// // //     { name: 'Team C', value: 91 },
// // //     { name: 'Team D', value: 67 }
// // //   ];

// // //   return (
// // //     <Dashboard
     
     
     
// // //     />
// // //   );
// // // };
// // // export default UserDashboard;
// // import React, { useEffect, useState } from 'react';
// // import Dashboard from "./../../compoents/Dashbord";
// // import axios from 'axios'; // Assuming axios is used for API calls

// // const AdminDashboard = () => {
// //   const [metrics, setMetrics] = useState({});
// //   const [taskStatusData, setTaskStatusData] = useState([]);
// //   const [taskPriorityData, setTaskPriorityData] = useState([]);

// //   useEffect(() => {
// //     // Fetch metrics, task status, and task priority data from the backend
// //     const fetchData = async () => {
// //       try {
// //         const metricsResponse = await axios.get('/api/admin/metrics');
// //         const statusResponse = await axios.get('/api/admin/task-status');
// //         const priorityResponse = await axios.get('/api/admin/task-priority');

// //         setMetrics(metricsResponse.data);
// //         setTaskStatusData(statusResponse.data);
// //         setTaskPriorityData(priorityResponse.data);
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   return (
// //     <Dashboard
// //       role="admin"
// //       metrics={metrics}
// //       taskStatusData={taskStatusData}
// //       taskPriorityData={taskPriorityData}
// //     />
// //   );
// // };

// // export default AdminDashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Dashboard from "./../../compoents/Dashbord";

// const AdminDashboard = () => {
//   let [cardData, setCardData] = useState({});
//   let [taskStatusData, setTaskStatusData] = useState({});
//   let [taskPriorityData, setTaskPriorityData] = useState({});
//   let [isLoading, setIsLoading] = useState(true);

//   const fetchTasks = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("https://localhost:8000/api/admin/tasks");
//       const tasks = response.data;

//       if (!Array.isArray(tasks)) throw new Error("Invalid response format");
  
//       let statusCounts = { open: 0, "in-progress": 0, completed: 0, failed: 0, deferred: 0 };
//       let priorityCounts = { low: 0, medium: 0, high: 0 };
  
//       tasks.forEach(task => {
//         if (task.status && statusCounts.hasOwnProperty(task.status)) {
//           statusCounts[task.status] += 1;
//         }
//         if (task.priority && priorityCounts.hasOwnProperty(task.priority)) {
//           priorityCounts[task.priority] += 1;
//         }
//       });
  
//       console.log("Updated Status Counts:", statusCounts);  
  
//       setCardData({
//         openTickets: statusCounts.open || 0,
//         pendingResponse: statusCounts["in-progress"] || 0,
//         resolvedIssues: statusCounts.completed || 0,
//         assignedEngineers: tasks.length || 0,
//       });
  
//       setTaskStatusData({
//         labels: ["open", "in-progress", "completed", "failed", "deferred"],
//         datasets: [{ label: "Task Status", data: Object.values(statusCounts), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"] }],
//       });
  
//       setTaskPriorityData({
//         labels: ["low", "medium", "high"],
//         datasets: [{ label: "Task Priority", data: Object.values(priorityCounts), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
//       });
  
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       setIsLoading(false);
//     }
//   };  

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return <Dashboard isLoading={isLoading} cardData={cardData} taskStatusData={taskStatusData} taskPriorityData={taskPriorityData} />;
// };

// export default AdminDashboard;
