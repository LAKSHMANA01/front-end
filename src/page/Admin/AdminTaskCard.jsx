import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, User } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { fetchDeferredTasks } from '../../redux/Slice/AdminSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminTaskCard = ({ task = {} }) => {
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [availableEngineers, setAvailableEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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


      const approvedEngineers =response.data.engineers.filter(engineer => engineer.isEngineer)
        setAvailableEngineers(approvedEngineers);
        setError(null);
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
      // setCurrentAssignee({
      //   name: selectedEngineer.name,
      //   initials: selectedEngineer.name.split(' ').map(n => n[0]).join(''),
      // });
      
      // Add reassignment comment
      const comment = {
        id: Date.now(),
        text: `Ticket reassigned to ${selectedEngineer.name}`,
        timestamp: new Date().toISOString(),
        author: 'Admin'
      };
      // setComments(prevComments => [...prevComments, comment]);
      
      // Close the dropdown
      setShowAssigneeDropdown(false);
      // Show success message if needed
      // You could add a success state here if desired
      dispatch(fetchDeferredTasks()); // update diferred tasks list
      toast.success(" Tickets reassign successfully!");
      
    } catch (err) {
      console.error('Error reassigning engineer:', err);
      setError(err.message || 'Failed to reassign engineer');
      toast.error("Failed to reassign tickets!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-lg shadow ml-16 mt-10 md:ml-0">
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

        
      </div>
      </div>
      <div>
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
    </>
  );
};

const getStatusStyle = (status) => {
  const styles = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    deferred: 'bg-gray-100 text-gray-800'
  };
  return `px-3 py-1 rounded-full text-sm ${styles[status?.toLowerCase()] || styles.pending}`;
};

export default AdminTaskCard;








