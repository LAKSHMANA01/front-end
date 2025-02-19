// // import React, { useState } from 'react';
// // import { Clock, AlertTriangle, User } from 'lucide-react';

// // const AdminTaskCard = ({ task = {} }) => {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [currentAssignee, setCurrentAssignee] = useState(task.assignee);
// //   const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

// //   // Destructure task with default values
// //   const {
// //     title = 'Untitled Task',
// //     description = 'No description provided',
// //     status = 'pending',
// //     priority = 'low',
// //     dueDate = null,
// //     comments: initialComments = []
// //   } = task;

// //   const [comments, setComments] = useState(initialComments);
// //   const [newComment, setNewComment] = useState('');

// //   // Sample assignees list - replace with your actual data
// //   const availableAssignees = [
// //     { id: 1, name: "John Doe", initials: "JD" },
// //     { id: 2, name: "Jane Smith", initials: "JS" },
// //     { id: 3, name: "Mike Brown", initials: "MB" }
// //   ];

// //   const handleAssigneeChange = (newAssignee) => {
// //     setCurrentAssignee(newAssignee);
// //     setShowAssigneeDropdown(false);
// //   };

// //   const handleAddComment = () => {
// //     if (newComment.trim()) {
// //       const comment = {
// //         id: Date.now(),
// //         text: newComment,
// //         timestamp: new Date().toISOString(),
// //         author: 'Admin'
// //       };
// //       setComments([...comments, comment]);
// //       setNewComment('');
// //     }
// //   };

// //   // Modal backdrop
// //   const Modal = ({ children }) => (
// //     isModalOpen && (
// //       <div className="fixed inset-0 z-50 flex items-center justify-center">
// //         <div 
// //           className="absolute inset-0 bg-black bg-opacity-50"
// //           onClick={() => setIsModalOpen(false)}
// //         />
// //         <div className="relative bg-white rounded-lg w-full max-w-2xl m-4 p-6 max-h-[90vh] overflow-y-auto">
// //           {children}
// //         </div>
// //       </div>
// //     )
// //   );

// //   return (
// //     <>
// //       {/* Card View */} 
// //       <div 
// //         onClick={() => setIsModalOpen(true)}
// //         className="w-full  max-w-md bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border"
// //       >
// //         <div className="p-4">
// //           {/* Card Header */}
// //           <div className="flex items-center mb-4">
// //             <div className="flex flex-col">
// //               <h3 className="font-semibold text-lg">{title}</h3>
// //               <span className={`text-sm ${getStatusStyle(status)}`}>
// //                 {status}
// //               </span>
// //             </div>
// //             <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
// //           </div>
          
// //           {/* Card Content */}
// //           <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>

// //           {/* Card Footer */}
// //           <div className="flex justify-between items-center">
// //             <div className="flex items-center space-x-2">
// //               <Clock className="w-4 h-4 text-gray-500" />
// //               <span className="text-sm text-gray-600">
// //                 Due {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
// //               </span>
// //             </div>
// //             <div className="flex items-center space-x-2">
// //               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
// //                 {currentAssignee?.initials || "?"}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modal View */}
// //       <Modal>
// //         <div className="flex justify-between items-start mb-6">
// //           <h2 className="text-xl font-semibold">{title}</h2>
// //           <button 
// //             onClick={() => setIsModalOpen(false)}
// //             className="text-gray-500 hover:text-gray-700"
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         <div className="space-y-6">
// //           {/* Task Details */}
// //           <div className="space-y-4">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center space-x-2">
// //                 <AlertTriangle className={`w-5 h-5 ${getPriorityTextColor(priority)}`} />
// //                 <span className="font-medium">Priority: {priority}</span>
// //               </div>
// //               <span className={`${getStatusStyle(status)}`}>{status}</span>
// //             </div>

// //             <div className="bg-gray-50 p-4 rounded-lg">
// //               <h4 className="font-medium mb-2">Description</h4>
// //               <p className="text-gray-600">{description}</p>
// //             </div>

// //             {/* Assignee Section with Dropdown */}
// //             <div className="relative">
// //               <div 
// //                 className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
// //                 onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
// //               >
// //                 <User className="w-5 h-5 text-gray-500" />
// //                 <span>Assignee: {currentAssignee?.name || "Unassigned"}</span>
// //               </div>
              
// //               {showAssigneeDropdown && (
// //                 <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-10">
// //                   {availableAssignees.map((assignee) => (
// //                     <div
// //                       key={assignee.id}
// //                       className="p-2 hover:bg-gray-50 cursor-pointer"
// //                       onClick={() => handleAssigneeChange(assignee)}
// //                     >
// //                       <div className="flex items-center space-x-2">
// //                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
// //                           {assignee.initials}
// //                         </div>
// //                         <span>{assignee.name}</span>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Comments Section */}
// //           <div className="space-y-4">
// //             <h4 className="font-medium">Comments</h4>
// //             <div className="space-y-4">
// //               {comments.map((comment) => (
// //                 <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
// //                   <div className="flex justify-between items-center mb-2">
// //                     <span className="font-medium">{comment.author}</span>
// //                     <span className="text-sm text-gray-500">
// //                       {new Date(comment.timestamp).toLocaleString()}
// //                     </span>
// //                   </div>
// //                   <p className="text-gray-600">{comment.text}</p>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Add Comment Input */}
// //             <div className="flex space-x-2">
// //               <input
// //                 type="text"
// //                 value={newComment}
// //                 onChange={(e) => setNewComment(e.target.value)}
// //                 placeholder="Add a comment..."
// //                 className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //               <button
// //                 onClick={handleAddComment}
// //                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
// //               >
// //                 Add
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </Modal>
// //     </>
// //   );
// // };

// // // Helper function for status styling
// // const getStatusStyle = (status) => {
// //   switch (status?.toLowerCase()) {
// //     case "completed":
// //       return "text-green-600 bg-green-100 px-3 py-1 rounded-full";
// //     case "in progress":
// //       return "text-blue-600 bg-blue-100 px-3 py-1 rounded-full";
// //     case "pending":
// //       return "text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full";
// //     default:
// //       return "text-gray-600 bg-gray-100 px-3 py-1 rounded-full";
// //   }
// // };

// // // Helper function for priority indicator color
// // const getPriorityColor = (priority) => {
// //   switch (priority?.toLowerCase()) {
// //     case "high":
// //       return "bg-red-500";
// //     case "medium":
// //       return "bg-yellow-500";
// //     default:
// //       return "bg-gray-400";
// //   }
// // };

// // // Helper function for priority text color
// // const getPriorityTextColor = (priority) => {
// //   switch (priority?.toLowerCase()) {
// //     case "high":
// //       return "text-red-500";
// //     case "medium":
// //       return "text-yellow-500";
// //     default:
// //       return "text-gray-500";
// //   }
// // };

// // export default AdminTaskCard;
// // components/AdminTaskCard.js
// import React, { useState, useEffect } from 'react';
// import { User } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAvailableEngineers, reassignTicket } from '../../redux/Slice/AdminSlice';
// import Modal from './Modal'; // Assuming you have a Modal component


// const AdminTaskCard = ({ task = {} }) => {
//   const dispatch = useDispatch();
//   const { availableEngineers, loading, error } = useSelector((state) => state.tasks);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentAssignee, setCurrentAssignee] = useState(task.assignee);
//   const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
//   const [isReassigning, setIsReassigning] = useState(false);

//   // Fetch available engineers when dropdown is opened
//   useEffect(() => {
//     if (showAssigneeDropdown) {
//       dispatch(fetchAvailableEngineers());
//     }
//   }, [showAssigneeDropdown, dispatch]);

//   // Handle assignee change when an engineer is selected
//   const handleAssigneeChange = async (engineer) => {
//     try {
//       setIsReassigning(true);
//       await dispatch(reassignTicket({
//         ticketId: task.id,
//         engineerId: engineer._id
//       })).unwrap();
      
//       setCurrentAssignee({
//         name: engineer.name,
//         initials: engineer.name.split(' ').map(n => n[0]).join(''),
//         id: engineer._id
//       });
//       setShowAssigneeDropdown(false);
//     } catch (error) {
//       console.error('Failed to reassign ticket:', error);
//     } finally {
//       setIsReassigning(false);
//     }
//   };

//   // Assignee Section Rendering
//   const renderAssigneeSection = () => (
//     <div className="relative">
//       <div 
//         className={`flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded ${isReassigning ? 'opacity-50 pointer-events-none' : ''}`}
//         onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
//       >
//         <User className="w-5 h-5 text-gray-500" />
//         <span>
//           {isReassigning ? 'Reassigning...' : `Engineer: ${currentAssignee?.name || "Unassigned"}`}
//         </span>
//       </div>
      
//       {showAssigneeDropdown && (
//         <div className="absolute top-full left-0 mt-1 w-96 bg-white border rounded-lg shadow-lg z-10">
//           {loading ? (
//             <div className="p-4 text-center">Loading engineers...</div>
//           ) : error ? (
//             <div className="p-4 text-center text-red-500">Error loading engineers</div>
//           ) : (
//             <div className="max-h-96 overflow-y-auto">
//               {availableEngineers.map((engineer) => (
//                 <div
//                   key={engineer._id}
//                   className="p-3 hover:bg-gray-50 cursor-pointer border-b"
//                   onClick={() => handleAssigneeChange(engineer)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                         {engineer.name.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="font-medium">{engineer.name}</span>
//                         <span className="text-sm text-gray-500">{engineer.specialization}</span>
//                       </div>
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       Tasks: {engineer.currentTasks}
//                     </div>
//                   </div>
//                   <div className="mt-2 text-sm text-gray-500">
//                     Available: {engineer.availability.join(', ')}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   // Return Modal with task details
//   return (
//     <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//       <div className="space-y-6">
//         {/* Task Details */}
//         <div className="space-y-4">
//           <div>
//             <h3 className="text-lg font-semibold">Task: {task.title}</h3>
//             <p>{task.description}</p>
//             {/* Assignee Section */}
//             {renderAssigneeSection()}
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };


import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, User } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { fetchDeferredTasks } from '../../redux/Slice/AdminSlice';
import { useDispatch } from 'react-redux';


const AdminTaskCard = ({ task = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignee, setCurrentAssignee] = useState(task.assignee);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [availableEngineers, setAvailableEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (showAssigneeDropdown) {
      fetchAvailableEngineers();
    }
  }, [showAssigneeDropdown]);
  

  const fetchAvailableEngineers = async () => {
    setLoading(true);
    try {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = days[new Date().getDay()];
      const response = await apiClient.get(`/admin/engineers/availability/${currentDay}`);
      if (!response) {
        throw new Error('Failed to fetch engineers');
      }

      const data = response.data;

      if (data && Array.isArray(data.engineers)) {
        const formattedEngineers = data.engineers.map(engineer => ({
          id: engineer._id,
          name: engineer.name,
          email: engineer.email,
          currentTasks: engineer.currentTasks,
          availability: engineer.availability,
          specialization: engineer.specialization,
          location: engineer.location
        }));
        setAvailableEngineers(formattedEngineers);
        setError(null);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch available engineers');
      console.error('Error fetching engineers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReassignEngineer = async (email) => {
    setLoading(true);
    setError(null);
    console.log("task all",task)
    
    try {
      // Validate inputs
      if (!task || !task._id) {
        throw new Error('Invalid task information');
      }
      
      if (!email) {
        throw new Error('Invalid engineer ID');
      }


      // Make the API call
      const response = await apiClient.patch(`/admin/reassign/${task._id}/${email}`,
        {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('response: ', response);
      if (!response) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to reassign engineer');
      }
      console.log(`email: ${email}`);
      
      const selectedEngineer = availableEngineers.find(eng => eng.email === email);
      
      if (!selectedEngineer) {
        throw new Error('Selected engineer not found in available engineers list');
      }
      
      // Update the UI
      setCurrentAssignee({
        name: selectedEngineer.name,
        initials: selectedEngineer.name.split(' ').map(n => n[0]).join(''),
      });
      
      // Add reassignment comment
      const comment = {
        id: Date.now(),
        text: `Ticket reassigned to ${selectedEngineer.name}`,
        timestamp: new Date().toISOString(),
        author: 'Admin'
      };
      setComments(prevComments => [...prevComments, comment]);
      
      // Close the dropdown
      setShowAssigneeDropdown(false);
      // Show success message if needed
      // You could add a success state here if desired
      dispatch(fetchDeferredTasks()); // update diferred tasks list
      
    } catch (err) {
      console.error('Error reassigning engineer:', err);
      setError(err.message || 'Failed to reassign engineer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow ml-16 mt-10">
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{task.serviceType}</h3>
          <span className={getStatusStyle(task.status)}>{task.status}</span>
          <span className={getStatusStyle(task.status)}>{task.priority}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-4">
        <p className="text-gray-600 ">{task.description}</p>
        
        {/* Current Assignee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span>Current Engineer: {task.engineerEmail || "Unassigned"}</span>
          </div>
          <button 
            onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reassign'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
            {error}
          </div>
        )}

        {/* Engineer Dropdown */}
        {showAssigneeDropdown && (
          <div className="mt-2 border rounded-lg shadow-lg">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {availableEngineers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No engineers available
                  </div>
                ) : (
                  availableEngineers.map((engineer) => (
                    <div
                      key={engineer._id}
                      onClick={() => !loading && handleReassignEngineer(engineer.email)}
                      className={`p-3 hover:bg-gray-50 cursor-pointer border-b flex items-center justify-between ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {engineer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{engineer.name}</div>
                          <div className="text-sm text-gray-500">
                            Current Load: {engineer.currentTasks} tasks
                          </div>
                          <div className="text-sm text-gray-500">
                            Specialization: {engineer.specialization}
                          </div>
                          <div className="text-sm text-gray-500">
                            Address: {engineer.address}
                          </div>
                          <div className="text-sm text-gray-500">
                            Pincode: {engineer.pincode}
                          </div>
                          <div className="text-sm text-gray-500">
                            Email: {engineer.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-green-500">Available</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Comments Section */}
        {/* <div className="mt-4">
          <h4 className="font-medium mb-2">Comments</h4>
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-gray-500">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{comment.text}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  const styles = {
    completed: 'bg-green-100 text-green-800',
    'in progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    deferred: 'bg-gray-100 text-gray-800'
  };
  return `px-3 py-1 rounded-full text-sm ${styles[status?.toLowerCase()] || styles.pending}`;
};

export default AdminTaskCard;