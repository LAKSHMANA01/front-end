import React, { useState } from 'react';
import { Clock, AlertTriangle, User } from 'lucide-react';

const AdminTaskCard = ({ task = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignee, setCurrentAssignee] = useState(task.assignee);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  // Destructure task with default values
  const {
    title = 'Untitled Task',
    description = 'No description provided',
    status = 'pending',
    priority = 'low',
    dueDate = null,
    comments: initialComments = []
  } = task;

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  // Sample assignees list - replace with your actual data
  const availableAssignees = [
    { id: 1, name: "John Doe", initials: "JD" },
    { id: 2, name: "Jane Smith", initials: "JS" },
    { id: 3, name: "Mike Brown", initials: "MB" }
  ];

  const handleAssigneeChange = (newAssignee) => {
    setCurrentAssignee(newAssignee);
    setShowAssigneeDropdown(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toISOString(),
        author: 'Admin'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  // Modal backdrop
  const Modal = ({ children }) => (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)}
        />
        <div className="relative bg-white rounded-lg w-full max-w-2xl m-4 p-6 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    )
  );

  return (
    <>
      {/* Card View */} 
      <div 
        onClick={() => setIsModalOpen(true)}
        className="w-full  max-w-md bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border"
      >
        <div className="p-4">
          {/* Card Header */}
          <div className="flex items-center mb-4">
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg">{title}</h3>
              <span className={`text-sm ${getStatusStyle(status)}`}>
                {status}
              </span>
            </div>
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
          </div>
          
          {/* Card Content */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>

          {/* Card Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Due {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                {currentAssignee?.initials || "?"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal View */}
      <Modal>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Task Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`w-5 h-5 ${getPriorityTextColor(priority)}`} />
                <span className="font-medium">Priority: {priority}</span>
              </div>
              <span className={`${getStatusStyle(status)}`}>{status}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{description}</p>
            </div>

            {/* Assignee Section with Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              >
                <User className="w-5 h-5 text-gray-500" />
                <span>Assignee: {currentAssignee?.name || "Unassigned"}</span>
              </div>
              
              {showAssigneeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-10">
                  {availableAssignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAssigneeChange(assignee)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {assignee.initials}
                        </div>
                        <span>{assignee.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Comments</h4>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Helper function for status styling
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "text-green-600 bg-green-100 px-3 py-1 rounded-full";
    case "in progress":
      return "text-blue-600 bg-blue-100 px-3 py-1 rounded-full";
    case "pending":
      return "text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full";
    default:
      return "text-gray-600 bg-gray-100 px-3 py-1 rounded-full";
  }
};

// Helper function for priority indicator color
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

// Helper function for priority text color
const getPriorityTextColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
};

export default AdminTaskCard;