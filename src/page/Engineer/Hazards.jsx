import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import { HazardsTickets ,HazardsUpdateTickets, HazardsDeleteTickets} from '../../redux/Slice/EngineerSlice';
import { Link, useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const EngineerDashboard = () => {
  const { Hazards, loading, error } = useSelector((state) => state.engineer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [updateFormData, setUpdateFormData] = useState({
    hazardType: '',
    description: '',
    riskLevel: '',
    address: '',
    pincode: '',
  });


  useEffect(() => {
    dispatch(HazardsTickets({})); // Fetch hazard tickets on mount
  }, [dispatch]);
  
  useEffect(() => {
    setFilteredTasks(Hazards.filter((task) => task.hazardType.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm,  Hazards]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateClick = (task) => {
    setSelectedTask(task);
    setUpdateFormData({
      _id:task._id,
      hazardType: task.hazardType,
      description: task.description,
      riskLevel: task.riskLevel,
      address: task.address,
      pincode: task.pincode,
    });
    setIsUpdateModalOpen(true);
    setIsModalOpen(false);
  };

 const handleDeleteClick = (task)=>{
  
   setIsUpdateModalOpen(false)
   console.log("deleted Hazards submitted:", task._id);
   dispatch(HazardsDeleteTickets(task._id))
   toast.success("Hazards deleted successfully!");
 }
 
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setIsUpdateModalOpen(false);
    // console.log("update Hazards submitted:", updateFormData);
  dispatch(HazardsUpdateTickets(updateFormData))
    
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md p-6 mb-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Hazards Tasks</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all">
            <Link to="/engineer/RiseTickets">Add Hazards</Link>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Tickets</h2>
        <input
          type="text"
          placeholder="Search by hazard type"
        
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => handleTaskClick(ticket)}
                className="border p-4 rounded-lg cursor-pointer hover:shadow-md transition"
              >
                <h3 className="font-bold">{ticket.hazardType}</h3>
                <p>{ticket.description}</p>
                <p className="text-sm text-gray-500">{ticket.riskLevel}</p>
                <p className="text-sm text-gray-500">{ticket.pincode}</p>
              </div>
            ))
          ) : (
            <p>Loading hazards...</p>
          )}
        </div>
      </div>

      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{selectedTask.hazardType}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">Risk Level</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedTask.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                  selectedTask.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedTask.riskLevel}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">Description</h4>
                <p>{selectedTask.description}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">Address</h4>
                <p>{selectedTask.address}</p>
                <p>Pincode: {selectedTask.pincode}</p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => handleUpdateClick(selectedTask)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Update</button>
              <button onClick={()=>handleDeleteClick(selectedTask)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Update Hazard</h2>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              <input type="text" name="hazardType" value={updateFormData.hazardType} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Hazard Type" required />
              <textarea name="description" value={updateFormData.description} onChange={handleInputChange} rows="3" className="w-full p-2 border rounded" placeholder="Description" required />
              <select name="riskLevel" value={updateFormData.riskLevel} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                <option value="">Select Risk Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input type="text" name="address" value={updateFormData.address} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Address" required />
              <input type="text" name="pincode" value={updateFormData.pincode} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Pincode" required />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
       <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default EngineerDashboard;
