// TicketForm.jsx
import React, { useState } from "react";


import { MapPin, AlertTriangle, Send } from "lucide-react";
import CustomCard from "../../compoents/CustomCard";
import { HazardsTicket } from "../../redux/Slice/raiseticke";
import { useDispatch,  } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketForm = () => {
  const userId = 2;
  const [ticketForm, setTicketForm] = useState({
   hazardType: "installation",
   description: "",
   riskLevel: "medium",
   address: "",
   pincode:""
  });
  // const navigate = useNavigate()
  const dispatch = useDispatch();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Ticket submitted:", ticketForm);
  
    // Make sure the data matches the backend's expected format
    const formData = {
      hazardType: ticketForm.hazardType, // "laksmana"
      description: ticketForm.description, // "Hazard Description"
      riskLevel: ticketForm.riskLevel, // Ensure you're passing the correct risk level from ticketForm
      address: ticketForm.address, // "satyam, vizag"
      pincode: ticketForm.pincode, // "530013"
    };
  
    try {
      const response = await dispatch(HazardsTicket(formData));
      toast.success("Ticket submitted successfully!");
      // console.log("Ticket submitted successfully:", response);
      // Reset form on success
      setTicketForm({
        hazardType: "installation", // Default value, can be changed by the user
        description: "",
        riskLevel: "medium", // Default, can be changed by the user
        address: "",
        pincode: "",
      });
      //  navigate("/admin/hazards")
    } catch (err) {
      console.error("Failed to submit ticket:", err);
    }
  };
  

  const inputStyles =
    "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <CustomCard  className=""title="Add New Hazards" icon={AlertTriangle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>

          <input
            type="text"
            className={inputStyles}
<<<<<<< HEAD
            placeholder="Address"
            value={ticketForm.address}
            required
          />

=======
            value={ticketForm.serviceType}
            onChange={(e) =>
              setTicketForm({ ...ticketForm,hazardType: e.target.value })
            }
            
          >
            <option value="installation">New Installation</option>
            <option value="fault">Fault Report</option>
            {/* <option value="maintenance">Maintenance Request</option> */}
          </select>
>>>>>>> ab8fe80f67ac7467229d3c0b627af2ee0e13ba33
        </div>
        <div>

          <input
            type="text"
            className={inputStyles}
            placeholder="Address"
            value={ticketForm.address}
            onChange={(e) =>
              setTicketForm({ ...ticketForm,  address: e.target.value })
            }
            required
          />

        </div>
        <div>
          <label className={labelStyles}>Description</label>
          <textarea
            className={inputStyles}
            rows={4}
            placeholder="Describe hazard in detail"
            value={ticketForm.description}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, description: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Priority Level</label>
          <select
            className={inputStyles}
            value={ticketForm.riskLevel}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, riskLevel: e.target.value })
            }
          >
            <option value="low">Low - Not Urgent</option>
            <option value="medium">Medium - Needs Attention</option>
            <option value="high">High - Urgent Issue</option>
          </select>
        </div>

        <div>
          <label className={labelStyles}>
           Enter pin Code
          </label>
          <input
            type="text"
            className={inputStyles}
            value={ticketForm.pincode}
            onChange={(e) => setTicketForm({...ticketForm,  pincode: e.target.value})}
          />
        </div>

        <div className="flex justify-between">

        <button
          type="submit"
          className="w-40 flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <Send size={16} />
          Submit Hazard
        </button>
        <button
          type="submit"
          className="w-40 flex items-center justify-center gap-2 bg-red-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <Send size={16} />
          cancel
        </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </CustomCard>
  );
};

export default TicketForm;
