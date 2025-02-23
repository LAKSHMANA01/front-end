import React from 'react';
import Dashboard from "./../../compoents/Dashbord";// Fixed the import path

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
    <Dashboard
      role="engineer"
      metrics={metrics}
      taskProgress={taskProgress}
      teamPerformance={teamPerformance}
    />
  );
};

export default EngineerDashboard;
