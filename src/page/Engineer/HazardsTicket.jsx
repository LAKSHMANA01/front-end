// // TicketForm.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { MapPin, AlertTriangle, Send } from "lucide-react";
// import CustomCard from "./CustomCard";
// import { HazardsTicket } from "../../redux/Slice/raiseticke";
// import { useDispatch, useSelector, } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const TicketForm = () => {
//   const userId = 2;
//   const [ticketForm, setTicketForm] = useState({
//    hazardType: "installation",
//    description: "",
//    riskLevel: "medium",
//    address: "",
//    pincode:""
//   });
//   const navigate = useNavigate()
//   const dispatch = useDispatch();
//   const Raisetickets = useSelector((state) => state.Raisetickets);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     console.log("Ticket submitted:", ticketForm);
  
//     // Make sure the data matches the backend's expected format
//     const formData = {
//       hazardType: ticketForm.hazardType, // "laksmana"
//       description: ticketForm.description, // "Hazard Description"
//       riskLevel: ticketForm.riskLevel, // Ensure you're passing the correct risk level from ticketForm
//       address: ticketForm.address, // "satyam, vizag"
//       pincode: ticketForm.pincode, // "530013"
//     };
  
//     try {
//       const response = await dispatch(HazardsTicket(formData));
//       toast.success("Ticket submitted successfully!");
//       console.log("Ticket submitted successfully:", response);
//       // Reset form on success
//       setTicketForm({
//         hazardType: "", // Default value, can be changed by the user
//         description: "",
//         riskLevel: "medium", // Default, can be changed by the user
//         address: "",
//         pincode: "",
//       });
//       // navigate("/engineer/Hazards")
//     } catch (err) {
//       console.error("Failed to submit ticket:", err);
//     }
//   };
  

//   const inputStyles =
//     "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
//   const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

//   return (
//     <CustomCard title="Add New Hazards" icon={AlertTriangle}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className={labelStyles}>Hazards Type</label>
//           <input
//             type="text"
//             className={inputStyles}
//             placeholder=" Enter Hazards Type"
//             value={ticketForm.hazardType}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm,  hazardType: e.target.value })
//             }
//             required
//           />
//         </div>
//         <div>
//         <label className={labelStyles}>Address</label>
//           <input
//             type="text"
//             className={inputStyles}
//             placeholder="Address"
//             value={ticketForm.address}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm,  address: e.target.value })
//             }
//             required
//           />

//         </div>
//         <div>
//           <label className={labelStyles}>Description</label>
//           <textarea
//             className={inputStyles}
//             rows={4}
//             placeholder="Describe your issue or request in detail"
//             value={ticketForm.description}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, description: e.target.value })
//             }
//             required
//           />
//         </div>

//         <div>
//           <label className={labelStyles}>Priority Level</label>
//           <select
//             className={inputStyles}
//             value={ticketForm.riskLevel}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, riskLevel: e.target.value })
//             }
//           >
//             <option value="low">Low - Not Urgent</option>
//             <option value="medium">Medium - Needs Attention</option>
//             <option value="high">High - Urgent Issue</option>
//           </select>
//         </div>

//         {/* <div>
//           <label className={labelStyles}>Contact Phone</label>
//           <input
//             type="tel"
//             className={inputStyles}
//             placeholder="Enter contact number"
//             value={ticketForm.contactPhone}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, contactPhone: e.target.value })
//             }
//             required
//           />
//         </div> */}

//         <div>
//           <label className={labelStyles}>
//            Enter pin Code
//           </label>
//           <input
//             type="text"
//             className={inputStyles}
//             value={ticketForm.pincode}
//             onChange={(e) => setTicketForm({...ticketForm,  pincode: e.target.value})}
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
//         >
//           <Send size={16} />
//           Submit Hazards
//         </button>
//       </form>
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
//     </CustomCard>
//   );
// };

// export default TicketForm;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MapPin, AlertTriangle, Send } from "lucide-react";
// import CustomCard from "./CustomCard";
// import { HazardsTicket } from "../../redux/Slice/raiseticke";
// import { useDispatch, useSelector } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const TicketForm = () => {
 
//   const [ticketForm, setTicketForm] = useState({
//     hazardType: "installation",
//     description: "",
//     riskLevel: "medium",
//     address: "",
//     pincode: "",
//   });

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const Raisetickets = useSelector((state) => state.Raisetickets);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Ticket submitted:", ticketForm);

//     const formData = {
//       hazardType: ticketForm.hazardType,
//       description: ticketForm.description,
//       riskLevel: ticketForm.riskLevel,
//       address: ticketForm.address,
//       pincode: ticketForm.pincode,
//     };

//     try {
//       const response = await dispatch(HazardsTicket(formData)).unwrap();
//       toast.success("Ticket submitted successfully!");
//       console.log("Ticket submitted successfully:", response);

//       // Reset form
//       setTicketForm({
//         hazardType: "",
//         description: "",
//         riskLevel: "medium",
//         address: "",
//         pincode: "",
//       });

//       // Navigate back to Hazards page after a short delay
//       setTimeout(() => {
//         navigate("/engineer/Hazards");
//       }, 1000);
//     } catch (err) {
//       console.error("Failed to submit ticket:", err);
//       toast.error("Failed to submit ticket. Try again.");
//     }
//   };

//   const inputStyles =
//     "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
//   const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

//   return (
//     <CustomCard title="Add New Hazards" icon={AlertTriangle}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className={labelStyles}>Hazards Type</label>
//           <input
//             type="text"
//             className={inputStyles}
//             placeholder="Enter Hazards Type"
//             value={ticketForm.hazardType}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, hazardType: e.target.value })
//             }
//             required
//           />
//         </div>
//         <div>
//           <label className={labelStyles}>Address</label>
//           <input
//             type="text"
//             className={inputStyles}
//             placeholder="Address"
//             value={ticketForm.address}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, address: e.target.value })
//             }
//             required
//           />
//         </div>
//         <div>
//           <label className={labelStyles}>Description</label>
//           <textarea
//             className={inputStyles}
//             rows={4}
//             placeholder="Describe your issue or request in detail"
//             value={ticketForm.description}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, description: e.target.value })
//             }
//             required
//           />
//         </div>

//         <div>
//           <label className={labelStyles}>Priority Level</label>
//           <select
//             className={inputStyles}
//             value={ticketForm.riskLevel}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, riskLevel: e.target.value })
//             }
//           >
//             <option value="low">Low - Not Urgent</option>
//             <option value="medium">Medium - Needs Attention</option>
//             <option value="high">High - Urgent Issue</option>
//           </select>
//         </div>

       

//         <div>
//           <label className={labelStyles}>Enter Pincode</label>
//           <input
//             type="text"
//             className={inputStyles}
//             value={ticketForm.pincode}
//             onChange={(e) =>
//               setTicketForm({ ...ticketForm, pincode: e.target.value })
//             }
//           />
//         </div>

//        <div className="flex justify-between  ">
//        <button
//           type="submit"
//           className="w-20  lg:w-40 flex items-center   bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
//         >
//           <Send size={16} />
//           Submit Hazards
//         </button>
//         <button
//           type="submit"
//           className="w-20   lg:w-40 flex items-center   bg-red-500 text-white p-1 rounded-md hover:bg-blue-600 transition-colors"
//           onClick={() =>  navigate("/engineer/Hazards")}
//         >
          
//           <Send size={16} />
//           Cannel Hazards
//         </button>


//        </div>
       
        
//       </form>
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
//     </CustomCard>
//   );
// };

// export default TicketForm;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertTriangle, Send } from "lucide-react";
import CustomCard from "../../compoents/CustomCard";
import { HazardsTicket } from "../../redux/Slice/raiseticke";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ticketForm, setTicketForm] = useState({
    hazardType: "",
    description: "",
    riskLevel: "medium",
    address: "",
    pincode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Ticket submitted:", ticketForm);

    const formData = {
      hazardType: ticketForm.hazardType,
      description: ticketForm.description,
      riskLevel: ticketForm.riskLevel,
      address: ticketForm.address,
      pincode: ticketForm.pincode,
    };

    try {
      await dispatch(HazardsTicket(formData)).unwrap();
      toast.success("Ticket submitted successfully!");

      setTimeout(() => {
        navigate("/engineer/Hazards"); // Redirect to Hazards page
      }, 1000);
    } catch (err) {
      console.error("Failed to submit ticket:", err);
      toast.error("Failed to submit ticket. Try again.");
    }
  };

  const inputStyles =
    "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent justify-center";
  
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <CustomCard title="Add New Hazards" icon={AlertTriangle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hazard-type" className={labelStyles}>Hazards Type</label>
          <input
          id="hazard-type"
            type="text"
            className={inputStyles}
            placeholder="Enter Hazard Type"
            value={ticketForm.hazardType}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, hazardType: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="hazard-address" className={labelStyles}>Address</label>
          <input
          id="hazard-address"
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Address"
            value={ticketForm.address}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, address: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="hazard-description" className={labelStyles}>Description</label>
          <textarea
          id="hazard-description"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority Level
          </label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label htmlFor="hazard-pincode" className={labelStyles}>Enter Pincode</label>
          <input
          id="hazard-pincode"
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={ticketForm.pincode}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, pincode: e.target.value })
            }
          />
        </div>

        <div className="flex justify-between  ">
          <button
          type="submit"
          className="w-40 flex items-center justify-center gap-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
          onClick={() =>  navigate("/engineer/Hazards")}
        >
          
          <X size={16} />
          Cancel
        </button>
       <button
          type="submit"
          className="w-40 flex items-center justify-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <span className="flex items-center justify-center w-full gap-2">
            <Send size={16} />
            Submit
          </span>
        </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </CustomCard>
  );
};

export default TicketForm;

