import React from "react";

const TaskCard = ({ task }) => {
  console.log(task);
  return (
    <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-blue-200">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Service Type : {task.serviceType}</h3>
          <br />
          <span className={`text-sm ${getStatusStyle(task.status)}`}>
            Status : {task.status}
          </span>
        </div>
      
      </div>

      {/* Card Body */}
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">Description : {task.description}</p>
        <p className="text-gray-600 text-sm">Address : {task.address}</p>
        <p className="text-gray-600 text-sm">Pincode : {task.pincode}</p>

        {/* Priority Indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
          <span className="text-sm text-gray-500">Priority : {task.priority} priority</span>
        </div>




        {/* Due Date and Assignee */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">

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
      {/* <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </div> */}
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
    case "open":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full";
      case "failed":
      return "text-red-600 bg-red-100 px-2 py-1 rounded-full";

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
