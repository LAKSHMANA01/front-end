// Example usage in a parent component:
import React from 'react';
import Dashboard from "./../../compoents/Dashbord"
const EngineerDashboard = () => {
  const metrics = {
    activeEngineers: 140,
    activeEngineersTrend: 5,
    activeEngineersStatus: 'success',
    completedTasks: 82,
    completedTasksTrend: 12,
    completedTasksStatus: 'success',
    pendingTasks: 20,
    pendingTasksTrend: -2,
    pendingTasksStatus: 'warning',
    totalTasks: 102,
    totalTasksTrend: 8,
    totalTasksStatus: 'neutral'
  };

  // Sample data for charts
  const taskProgress = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 58 },
    { name: 'Jun', value: 65 }
  ];

  const teamPerformance = [
    { name: 'Team A', value: 85 },
    { name: 'Team B', value: 72 },
    { name: 'Team C', value: 91 },
    { name: 'Team D', value: 67 }
  ];

  return (
<<<<<<< HEAD
    <Dashboard
    role="engineer"
    
     
     
    />
=======
      <div className=" grow p-8  dark:bg-gray-900 dark:text-white dark:border-gray-600">
        <h1 className="text-2xl mb-4 font-bold">DashBoard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <Card icon={< FaUserCog/>} title="Active Engineers" value="140" /> */}
          <Card icon={<FaBox />} title="Completed Task" value="02" />
          <Card icon={< FaRegClock />} title="pending task" value="110" />
          {/* <Card icon={< FaMapPin />} title="total sites" value="11" /> */}
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 " >
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h3 className="text-gl font-semibold mb-4">Task Progress</h3>
            <Line data={dataLine} /> 
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h3 className="text-gl font-semibold mb-4">Team Performance</h3>
            <Bar data={dataBar}/>
          </div>
        </div>
      </div>
>>>>>>> c75d79a5141a927d4bee2730251d73215522ca84
  );
};
export default EngineerDashboard;