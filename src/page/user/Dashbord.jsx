// // Example usage in a parent component:
// import React from 'react';
// import Dashboard from "./../../compoents/Dashbord"


// const UserDashboard = () => {


//   const metrics = {
//     activeEngineers: 140,
//     activeEngineersTrend: 5,
//     activeEngineersStatus: 'success',
//     completedTasks: 82,
//     completedTasksTrend: 12,
//     completedTasksStatus: 'success',
//     pendingTasks: 20,
//     pendingTasksTrend: -2,
//     pendingTasksStatus: 'warning',
//     totalTasks: 102,
//     totalTasksTrend: 8,
//     totalTasksStatus: 'neutral'
//   };

//   // Sample data for charts
//   const taskProgress = [
//     { name: 'Jan', value: 45 },
//     { name: 'Feb', value: 52 },
//     { name: 'Mar', value: 48 },
//     { name: 'Apr', value: 61 },
//     { name: 'May', value: 58 },
//     { name: 'Jun', value: 65 }
//   ];

//   const teamPerformance = [
//     { name: 'Team A', value: 85 },
//     { name: 'Team B', value: 72 },
//     { name: 'Team C', value: 91 },
//     { name: 'Team D', value: 67 }
//   ];

//   return (
//     <Dashboard
//      />
//   );
// };
// export default UserDashboard;
import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import Dashbord from "./../../compoents/Dashbord";
import { fetchTickets } from "../../redux/Slice/UserSlice";
import apiClient from "../../utils/apiClientUser";

const UserDashboard = ({ debouncedSearchTerm = "", statusFilter = "", priorityFilter = "" }) => {
  const email=sessionStorage.getItem("email")
 
  const { tasks, loading, error } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();

   useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        const response = await apiClient.get(`/tasks/user/${email}`);
        dispatch(fetchTickets.fulfilled(response.data));
      } catch (error) {
        console.error("Error fetching engineer tasks:", error);
        dispatch(fetchTickets.rejected(error.response?.data || "Failed to fetch engineer tasks"));
      }
    };
    fetchTicketsData();
  }, [dispatch, email]);

     const filteredTasks = Array.isArray(tasks) ? tasks.filter((task) => {
      const serviceType = task?.serviceType?.toLowerCase() || "";
      const status = task?.status?.toLowerCase() || "";
      const priority = task?.priority?.toLowerCase() || "";
    
      const matchesSearchTerm = serviceType.includes(debouncedSearchTerm.toLowerCase());
      const matchesStatusFilter = statusFilter ? status === statusFilter.toLowerCase() : true;
      const matchesPriorityFilter = priorityFilter ? priority === priorityFilter.toLowerCase() : true;
    
      return matchesSearchTerm && matchesStatusFilter && matchesPriorityFilter;
    }) : [];

  const ticketStatusCounts = {
    open: 0,
    "in-progress": 0,
    completed: 0,
    failed: 0,
    deferred: 0,
  };

  const taskPriorityCounts = {
    low: 0,
    medium: 0,
    high: 0,
  };

  console.log("filteredTasks", filteredTasks);

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
  
  const userData = {
    completedTasks: tasks.filter(task => task.status === "completed"),
    pendingTasks: tasks.filter(task => task.status === "pending"),
    totalTasks: tasks.filter(task => task.status === "open"),
    failedTasks: tasks.filter(task => task.status==="failed"),
  };
  
  return <Dashbord role="user" ticketStatusData={ticketStatusData} taskPriorityData={taskPriorityData} loading={loading} error={error} data={userData}/>;
};

export default UserDashboard;