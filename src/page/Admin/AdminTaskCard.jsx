import React from "react";

const AdminTaskCard = ({ task }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-blue-200">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <span className={`text-sm ${getStatusStyle(task.status)}`}>
            {task.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">{task.description}</p>

        {/* Priority Indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
          <span className="text-sm text-gray-500">{task.priority}</span>
        </div>

        {/* Due Date and Assignee */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs text-blue-600">{task.assignee?.initials || "?"}</span>
            </div>
            <span className="text-sm text-gray-500">{task.assignee?.name || "Unassigned"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for styling
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "text-green-600 bg-green-100 px-2 py-1 rounded-full";
    case "in progress":
      return "text-blue-600 bg-blue-100 px-2 py-1 rounded-full";
    case "pending":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full";
    default:
      return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full";
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
};

export default AdminTaskCard;
