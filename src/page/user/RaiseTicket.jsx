// TicketForm.jsx
import React, { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import CustomCard from "./../../compoents/CustomCard";
import { submitTicket } from "../../redux/Slice/raiseticke";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./../../compoents/footers";
const email = sessionStorage.getItem('email');

const token = sessionStorage.getItem('token');
console.log(email, token);
const TicketForm = () => {  
  const [ticketForm, setTicketForm] = useState({
    serviceType: "installation",
    address: "",
    description: "",
    pincode: "",
  });
  const dispatch = useDispatch();
  const Raisetickets = useSelector((state) => state.Raisetickets);
  const user = useSelector((state) => state.auth.user);

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("djabfkalnsdlmfasdfasdf", email)
  if (!email) {
    toast.error("User email not found!");
    return;
  }

  try {
    await dispatch(submitTicket({ ...ticketForm, email })); 
    toast.success("Ticket submitted successfully!");
    
    // Reset form on success
    setTicketForm({
      serviceType: "installation",
      address: "",
      description: "",
      pincode: "",
    });
  } catch (err) {
    console.error("Failed to submit ticket:", err);
    toast.error("Failed to submit ticket!");
  }
};


  const inputStyles =
    "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1 ";

  return (
    <div className="">
   <div className="mb-20">
   <CustomCard title="Raise New Ticket" icon={AlertTriangle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelStyles}>Service Type</label>
          <select
            className={inputStyles}
            value={ticketForm.serviceType}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, serviceType: e.target.value })
            }
            required
          >
            <option value="installation">New Installation</option>
            <option value="fault">Fault Report</option>
            {/* <option value="maintenance">Maintenance Request</option> */}
          </select>
        </div>
        <div>
          <label className={labelStyles}>Address</label>
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
            placeholder="Describe your issue or request in detail"
            value={ticketForm.description}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, description: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Pincode</label>
          <input
            type="tel"
            className={inputStyles}
            placeholder="Enter pincode"
            value={ticketForm.pincode}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, pincode: e.target.value })
            }
            required
          />
        </div>

        {/* <div>
          <label className={labelStyles}>
            Preferred Service Date
          </label>
          <input
            type="date"
            className={inputStyles}
            value={ticketForm.preferredDate}
            onChange={(e) => setTicketForm({...ticketForm, preferredDate: e.target.value})}
          />
        </div> */}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <Send size={16} />
          Submit Ticket
        </button>
      </form>
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
      
    </CustomCard>
   </div>
   <div className="mt-6">
      <Footer />
      </div>
    </div>
     
  );
};

export default TicketForm;

// import "react-toastify/dist/ReactToastify.css";
// import Footer from "./../../compoents/footers";
// toast.success("Ticket submitted successfully!");
// toast.success("Ticket submitted successfully!");
// <ToastContainer 
// position="top-right"
// autoClose={5000}
// hideProgressBar={false}
// newestOnTop={false}
// closeOnClick
// rtl={false}
// pauseOnFocusLoss
// draggable
// pauseOnHover
// />