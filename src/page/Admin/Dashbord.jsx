// // Example usage in a parent component:
// import React from 'react';
// import Dashboard from "./../../compoents/Dashbord"
// const AdminDashboard = () => {
//   // Sample data for metrics
//   const { tasks, loading, error } = useSelector((state) => state.admin);
//  const filteredTasks = tasks.filter(task => {
//     //console.log("task priority:",task.priority)
//     const matchesSearchTerm = task.serviceType.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
//     const matchesStatusFilter = statusFilter ? task.status.toLowerCase() === statusFilter.toLowerCase() : true;
//     //console.log("before priority:",task.priority)
//     const matchesPriorityusFilter = priorityFilter ? task.priority === priorityFilter.toLowerCase() : true;
//     return matchesSearchTerm && matchesStatusFilter && matchesPriorityusFilter;
//   });

//   return (
//     <Dashboard
     
     
     
//     />
//   );
// };
// export default AdminDashboard;
// import React from "react";
// import { useSelector } from "react-redux";
// import Dashbord from "./../../compoents/Dashbord";

// const AdminDashboard = ({ debouncedSearchTerm, statusFilter, priorityFilter }) => {
//   const { tasks, loading, error } = useSelector((state) => state.admin);

//   const filteredTasks = tasks.filter((task) => {
//     const matchesSearchTerm = task.serviceType.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
//     const matchesStatusFilter = statusFilter ? task.status.toLowerCase() === statusFilter.toLowerCase() : true;
//     const matchesPriorityFilter = priorityFilter ? task.priority.toLowerCase() === priorityFilter.toLowerCase() : true;
//     return matchesSearchTerm && matchesStatusFilter && matchesPriorityFilter;
//   });

//   // Ticket status counts
//   const ticketStatusCounts = {
//     open: 0,
//     "in-progress": 0,
//     completed: 0,
//     failed: 0,
//     deferred: 0,
//   };

//   // Task priority counts
//   const taskPriorityCounts = {
//     low: 0,
//     medium: 0,
//     high: 0,
//   };

//   if (!loading && Array.isArray(filteredTasks)) {
//     filteredTasks.forEach((task) => {
//       if (ticketStatusCounts[task.status]) {
//         ticketStatusCounts[task.status] += 1;
//       }
//       if (taskPriorityCounts[task.priority]) {
//         taskPriorityCounts[task.priority] += 1;
//       }
//     });
//   }

//   const ticketStatusData = {
//     labels: Object.keys(ticketStatusCounts),
//     datasets: [
//       {
//         label: "Ticket Status",
//         data: Object.values(ticketStatusCounts),
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
//         borderWidth: 2,
//       },
//     ],
//   };

//   const taskPriorityData = {
//     labels: Object.keys(taskPriorityCounts),
//     datasets: [
//       {
//         label: "Task Priority",
//         data: Object.values(taskPriorityCounts),
//         backgroundColor: ["#4CAF50", "#FFCE56", "#FF6384"],
//         borderWidth: 2,
//       },
//     ],
//   };

//   return <Dashbord ticketStatusData={ticketStatusData} taskPriorityData={taskPriorityData} loading={loading} />;
// };

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import Dashbord from "./../../compoents/Dashbord";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks,fetchAllApprovedEngineers,fetchAllEngineers} from "../../redux/Slice/AdminSlice";

const AdminDashboard = ({ debouncedSearchTerm = "", statusFilter = "", priorityFilter = "" }) => {
  
  const { tasks, loading,error,approvedEngineers,engineers } = useSelector((state) => state.admin);
  
   console.log("hdjhfasd1122323s", approvedEngineers)
  


    const dispatch = useDispatch();
    useEffect(() => {
       dispatch(fetchAllTasks());
       dispatch(fetchAllApprovedEngineers());
       dispatch(fetchAllEngineers()); // Fetch all tasks on mount
     }, [dispatch]);


  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await ApiClient.get("/admin/tasks"); // API call to fetch tasks
  //       setTasks(response.data || []); // Ensure tasks is always an array
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTasks();
  // }, []);

  const filteredTasks = Array.isArray(tasks) ? tasks.filter((task) => {
    const serviceType = task?.serviceType?.toLowerCase() || "";
    const status = task?.status?.toLowerCase() || "";
    const priority = task?.priority?.toLowerCase() || "";
  
    const matchesSearchTerm = serviceType.includes(debouncedSearchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter ? status === statusFilter.toLowerCase() : true;
    const matchesPriorityFilter = priorityFilter ? priority === priorityFilter.toLowerCase() : true;
  
    return matchesSearchTerm && matchesStatusFilter && matchesPriorityFilter;
  }) : [];

  //const filteredEngineers=Array.isArray(approvedEngineers)? approvedEngineers:[]
  

  // Ticket status counts
  const ticketStatusCounts = {
    open: 0,
    "in-progress": 0,
    completed: 0,
    failed: 0,
    deferred: 0,
  };

  // Task priority counts
  const taskPriorityCounts = {
    low: 0,
    medium: 0,
    high: 0,
  };

  if (!loading && Array.isArray(filteredTasks)) {
    filteredTasks.forEach((task) => {
      const status = task?.status?.toLowerCase();
      const priority = task?.priority?.toLowerCase();

      if (status && ticketStatusCounts[status] !== undefined) {
        ticketStatusCounts[status] += 1;
      }
      if (priority && taskPriorityCounts[priority] !== undefined) {
        taskPriorityCounts[priority] += 1;
      }
    });
  }

  const ticketStatusData = {
    labels: Object.keys(ticketStatusCounts),
    datasets: [
      {
        label: "Ticket Status",
        data: Object.values(ticketStatusCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
        borderWidth: 2,
      },
    ],
  };

  const taskPriorityData = {
    labels: Object.keys(taskPriorityCounts),
    datasets: [
      {
        label: "Task Priority",
        data: Object.values(taskPriorityCounts),
        backgroundColor: ["#4CAF50", "#FFCE56", "#FF6384"],
        borderWidth: 2,
      },
    ],
  };
  const adminData = {
    openTickets: tasks.filter(task => task.status === "open"),
    resolvedTickets: tasks.filter(task => task.status === "completed"),
    approvedEngineers:approvedEngineers,
    allEngineers:engineers,
  };
  return <Dashbord ticketStatusData={ticketStatusData} taskPriorityData={taskPriorityData} loading={loading} data={adminData} />;
};

export default AdminDashboard;

