// import React, { useEffect } from "react";
// import {
//   FaBox,
//   FaMapPin,
//   FaRegClock,
//   FaUserCog,
//   FaUsers,
// } from "react-icons/fa";
// import { Line, Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// import Card from "./Card";

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);


// const Dashboard = () => {
//   // const role = "engineer";
//   const role = sessionStorage.getItem("role");

//   // const dispatch = useDispatch();
//   // const { profile } = useSelector((state) => state.tickets);

//   // useEffect(() => {
//   //   if (!profile.email) {
//   //     dispatch(fetchProfile({ userEmail, role }));
//   //   }
//   // }, [dispatch, profile.email, userEmail, role]);

//   // Role-based card configurations
  
//   const getCardConfig = (role) => {
//     const cardData = {
//       user: [
//         { icon: <FaUserCog />, title: "Active Engineers", value: "140" },
//         { icon: <FaBox />, title: "Completed Task", value: "82" },
//         { icon: <FaRegClock />, title: "Pending task", value: "20" },
//         { icon: <FaMapPin />, title: "Total Task", value: "102" },
//       ],
//       engineer: [
//         { icon: <FaBox />, title: "My Active Tasks", value: "12" },
//         { icon: <FaRegClock />, title: "Pending Reviews", value: "5" },
//         { icon: <FaMapPin />, title: "Completed Tasks", value: "45" },
//         { icon: <FaUsers />, title: "Team Size", value: "8" },
//       ],
//       admin: [
//         { icon: <FaBox />, title: "Open Tickets", value: "3" },
//         { icon: <FaRegClock />, title: "Pending Response", value: "1" },
//         { icon: <FaMapPin />, title: "Resolved Issues", value: "15" },
//         { icon: <FaUserCog />, title: "Assigned Engineers", value: "2" },
//       ],
//     };
//     return cardData[role] || [];
//   };

//   // Role-based chart data
//   const getChartData = (role) => {
//     const chartData = {
//       admin: {
//         taskProgress: {
//           labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//           datasets: [{ label: "Tasks", data: [45, 52, 48, 61, 58], backgroundColor: "rgba(75,192,192,0.4)", borderColor: "rgba(75,192,192,1)", borderWidth: 2 }],
//         },
//         teamPerformance: {
//           labels: ["Team A", "Team B", "Team C", "Team D"],
//           datasets: [{ label: "Performance", data: [85, 72, 91, 67], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"] }],
//         },
//       },
//       engineer: {
//         taskProgress: {
//           labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
//           datasets: [{ label: "Tasks", data: [8, 12, 10, 15], backgroundColor: "rgba(153,102,255,0.2)", borderColor: "rgba(153,102,255,1)", borderWidth: 2 }],
//         },
//         teamPerformance: {
//           labels: ["Code Reviews", "Bug Fixes", "Features", "Documentation"],
//           datasets: [{ label: "Tasks", data: [25, 18, 12, 8], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"] }],
//         },
//       },
//       user: {
//         taskProgress: {
//           labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//           datasets: [{ label: "User Tasks", data: [5, 3, 4, 2, 1], backgroundColor: "rgba(153,102,255,0.2)", borderColor: "rgba(153,102,255,1)", borderWidth: 2 }],
//         },
//         teamPerformance: {
//           labels: ["Response Time", "Resolution Rate", "Satisfaction"],
//           datasets: [{ label: "Performance", data: [92, 88, 95], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
//         },
//       },
//     };
//     return chartData[role];
//   };

//   const cardConfig = getCardConfig(role);
//   const chartData = getChartData(role);

//   return (
//     <div className="grow p-6 dark:bg-gray-900 dark:text-white">
//       <h1 className="text-2xl font-bold mb-6 mt-10">Dashboard</h1>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {cardConfig.length > 0 ? cardConfig.map((card, index) => <Card key={index} icon={card.icon} title={card.title} value={card.value} />) : <p>No data available</p>}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
//         <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
//           <h3 className="text-lg font-semibold mb-4">Task Progress</h3>
//           {chartData.taskProgress ? <Line data={chartData.taskProgress} /> : <p>No Task Data</p>}
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
//           <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
//           {chartData.teamPerformance ? <Bar data={chartData.teamPerformance} /> : <p>No Team Data</p>}
//         </div>
//       </div>

//       {/* Toast Notifications */}
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//     </div>
//   );
// };

// export default Dashboard;
import React from "react";
import { FaBox, FaRegClock, FaUserCog, FaMapPin } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "./Card";

const Dashboard = ({ role="", isLoading, cardData, taskStatusData, taskPriorityData }) => {
  let cardConfig = [];

  switch (role) {
    case "admin":
      cardConfig = [
        { icon: <FaUserCog />, title: "Active Engineers", value: cardData.activeEngineers || 0 },
        { icon: <FaBox />, title: "Completed Tasks", value: cardData.completedTasks || 0 },
        { icon: <FaRegClock />, title: "Pending Tasks", value: cardData.pendingTasks || 0 },
        { icon: <FaMapPin />, title: "Total Tasks", value: cardData.totalTasks || 0 },
      ];
      break;

    case "engineer":
      cardConfig = [
        { icon: <FaBox />, title: "Completed Tasks", value: cardData.completedTasks || 0 },
        { icon: <FaRegClock />, title: "Pending Tasks", value: cardData.pendingTasks || 0 },
        { icon: <FaMapPin />, title: "Total Assigned Tasks", value: cardData.totalTasks || 0 },
      ];
      break;

    case "user":
      cardConfig = [
        { icon: <FaBox />, title: "Completed Tickets", value: cardData.completedTickets || 0 },
        { icon: <FaRegClock />, title: "Pending Tickets", value: cardData.pendingTickets || 0 },
        { icon: <FaMapPin />, title: "Total Tickets", value: cardData.totalTickets || 0 },
      ];
      break;

    default:
      break;
  }

  return (
    <div className="grow p-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardConfig.map((card, index) => (
          <Card key={index} icon={card.icon} title={card.title} value={card.value} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">{role === "user" ? "Ticket" : "Task"} Status Overview</h3>
          {isLoading ? <p>Loading chart data...</p> : <Bar data={taskStatusData || { labels: [], datasets: [] }} />}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">{role === "user" ? "Ticket" : "Task"} Priority Overview</h3>
          {isLoading ? <p>Loading chart data...</p> : <Bar data={taskPriorityData} />}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Dashboard;

