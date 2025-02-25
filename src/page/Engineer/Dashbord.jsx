// // // import React, { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import Dashboard from "./../../compoents/Dashbord";

// // // const EngineerDashboard = () => {
// // //   let [taskStatusData, setTaskStatusData] = useState({});
// // //   let [taskPriorityData, setTaskPriorityData] = useState({});
// // //   let [isLoading, setIsLoading] = useState(true);

// // //   const fetchTasks = async () => {
// // //     try {
// // //       setIsLoading(true);
// // //       const response = await axios.get("https://localhost:8000/api/tasks/engineer");
// // //       const tasks = response.data;

// // //       if (!Array.isArray(tasks)) throw new Error("Invalid response format");

// // //       const statusCounts = { open: 0, "in-progress": 0, completed: 0, failed: 0, deferred: 0 };
// // //       const priorityCounts = { low: 0, medium: 0, high: 0 };

// // //       tasks.forEach(task => {
// // //         if (statusCounts[task.status] !== undefined) statusCounts[task.status] += 1;
// // //         if (priorityCounts[task.priority] !== undefined) priorityCounts[task.priority] += 1;
// // //       });

// // //       setTaskStatusData({
// // //         labels: Object.keys(statusCounts),
// // //         datasets: [{ label: "Task Status", data: Object.values(statusCounts), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"] }],
// // //       });

// // //       setTaskPriorityData({
// // //         labels: Object.keys(priorityCounts),
// // //         datasets: [{ label: "Task Priority", data: Object.values(priorityCounts), backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
// // //       });

// // //       setIsLoading(false);
// // //     } catch (error) {
// // //       console.error("Error fetching tasks:", error);
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchTasks();
// // //   }, []);

// // //   return <Dashboard isLoading={isLoading} taskStatusData={taskStatusData} taskPriorityData={taskPriorityData} />;
// // // };

// // // export default EngineerDashboard;
// // import React from "react";
// // import { FaBox, FaRegClock, FaMapPin } from "react-icons/fa";
// // import { Bar } from "react-chartjs-2";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import Card from "./Card";
// // import Dashbord from "../../compoents/Dashbord"

// // const EngineerDashboard = ({ isLoading, cardData, taskStatusData, taskPriorityData }) => {
// //   const cardConfig = [
// //     { icon: <FaBox />, title: "Completed Tasks", value: cardData.completedTasks || 0 },
// //     { icon: <FaRegClock />, title: "Pending Tasks", value: cardData.pendingTasks || 0 },
// //     { icon: <FaMapPin />, title: "Total Assigned Tasks", value: cardData.totalTasks || 0 },
// //   ];

// //   return (
// //     <div className="grow p-6 dark:bg-gray-900 dark:text-white">
// //       <h1 className="text-2xl font-bold mb-6">Engineer Dashboard</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //         {cardConfig.map((card, index) => (
// //           <Card key={index} icon={card.icon} title={card.title} value={card.value} />
// //         ))}
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
// //         <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
// //           <h3 className="text-lg font-semibold mb-4">Task Status Overview</h3>
// //           {isLoading ? <p>Loading chart data...</p> : <Bar data={taskStatusData} />}
// //         </div>
// //         <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
// //           <h3 className="text-lg font-semibold mb-4">Task Priority Overview</h3>
// //           {isLoading ? <p>Loading chart data...</p> : <Bar data={taskPriorityData} />}
// //         </div>
// //       </div>

// //       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
// //     </div>
// //   );
// // };

// // export default EngineerDashboard;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Dashbord from "../../compoents/Dashbord";
// import apiClient from "../../utils/apiClient";

// const email = sessionStorage.getItem('email');
// const role = sessionStorage.getItem('role');
// const EngineerDashboard = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [cardData, setCardData] = useState({});
//   const [taskStatusData, setTaskStatusData] = useState({});
//   const [taskPriorityData, setTaskPriorityData] = useState({});

//   useEffect(() => {
//     apiClient.get(`/tickets/${role}/${email}`)
//       .then((response) => {
//         const data = response.data;
//         setCardData({
//           completedTasks: data.completedTasks,
//           pendingTasks: data.pendingTasks,
//           totalTasks: data.totalTasks
//         });
//         setTaskStatusData(data.taskStatusData);
//         setTaskPriorityData(data.taskPriorityData);
//       })
//       .catch((error) => console.error("Error fetching engineer data:", error))
//       .finally(() => setIsLoading(false));
//   }, []);

//   return <Dashbord role="engineer" isLoading={isLoading} cardData={cardData} taskStatusData={taskStatusData} taskPriorityData={taskPriorityData} />;
// };

// export default EngineerDashboard;

