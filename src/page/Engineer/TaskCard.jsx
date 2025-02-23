import React from "react";

const TaskCard = ({ task }) => {
  console.log(task);
  return (
    <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-blue-200">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
<<<<<<< HEAD
          <h3 className="text-lg font-semibold text-gray-900">Service Type : {task.serviceType}</h3>
=======
          <h3 className="text-lg font-semibold text-gray-900">
            {task.serviceType}
          </h3>
>>>>>>> ab8fe80f67ac7467229d3c0b627af2ee0e13ba33
          <span className={`text-sm ${getStatusStyle(task.status)}`}>
            Status : {task.status}
          </span>
        </div>
        <button className="text-gray-400 hover:text-blue-600 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">Description: {task.description}</p>

        {/* Priority Indicator */}
        <div className="flex items-center gap-2">
<<<<<<< HEAD
          <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
          <span className="text-sm text-gray-500">Priority : {task.priority} priority</span>
=======
          <span
            className={`w-3 h-3 rounded-full ${getPriorityColor(
              task.priority
            )}`}
          ></span>
          <span className="text-sm text-gray-500">
            {task.priority} priority
          </span>
>>>>>>> ab8fe80f67ac7467229d3c0b627af2ee0e13ba33
        </div>

        {/* Progress Bar
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div> */}

        {/* Due Date and Assignee */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs text-blue-600">{task.assignee?.initials || 'N/A'}</span>
            </div>
            <span className="text-sm text-gray-500">
              Assigned to: {task.engineerEmail || 'Not assigned'}
            </span>
          </div> */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-500">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-500">
              Updated: {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 hover:bg-blue-50 rounded-lg text-blue-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Helper functions for styling
const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "text-green-600 bg-green-100 px-2 py-1 rounded-full";
    case "in-progress":
      return "text-blue-600 bg-blue-100 px-2 py-1 rounded-full";
    case "pending":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full";
    default:
      return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
};

const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-blue-500";
};

export default TaskCard;
