// TicketForm.jsx
import React, { useState } from "react";
import { MapPin, AlertTriangle, Send } from "lucide-react";
import CustomCard from "./CustomCard";
import { submitTicket } from "../../redux/Slice/raiseticke";
import { useDispatch, useSelector } from "react-redux";

const TicketForm = () => {
  const userId = 2;
  const [ticketForm, setTicketForm] = useState({
    serviceType: "installation",
    address: "",
    description: "",
    priority: "medium",
  });
  const dispatch = useDispatch();
  const Raisetickets = useSelector((state) => state.Raisetickets);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Ticket submitted:", ticketForm);

    const formDatawithUserId = {
      ...ticketForm,
      //  userId: userId // Add userId to the submitted data
    };
    try {
      await dispatch(submitTicket({ ...ticketForm }));
      // Reset form on success
      setTicketForm({
        serviceType: "installation",
        address: "",
        description: "",
        priority: "medium",
      });
    } catch (err) {
      console.error("Failed to submit ticket:", err);
    }
  };

  const inputStyles =
    "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

  return (
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
            required99
          >
            <option value="installation">New Installation</option>
            <option value="fault">Fault Report</option>
            {/* <option value="maintenance">Maintenance Request</option> */}
          </select>
        </div>
        <div>
          {/* <input
          type="text"
          className={inputStyles}
          placeholder="Latitude"
          value={ticketForm.location.latitude}
          onChange={(e) =>
            setTicketForm((prevState) => ({
              ...prevState,
              location: {
                ...prevState.location,
                latitude: e.target.value,
              },
            }))
          }
          required
        /> */}

          {/* <input
          type="text"
          className={inputStyles}
          placeholder="Longitude"
          value={ticketForm.location.longitude}
          onChange={(e) =>
            setTicketForm((prevState) => ({
              ...prevState,
              location: {
                ...prevState.location,
                longitude: e.target.value,
              },
            }))
          }
          required
        /> */}

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
          <label className={labelStyles}>Priority Level</label>
          <select
            className={inputStyles}
            value={ticketForm.priority}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, priority: e.target.value })
            }
          >
            <option value="low">Low - Not Urgent</option>
            <option value="medium">Medium - Needs Attention</option>
            <option value="high">High - Urgent Issue</option>
          </select>
        </div>

        {/* <div>
          <label className={labelStyles}>Contact Phone</label>
          <input
            type="tel"
            className={inputStyles}
            placeholder="Enter contact number"
            value={ticketForm.contactPhone}
            onChange={(e) =>
              setTicketForm({ ...ticketForm, contactPhone: e.target.value })
            }
            required
          />
        </div> */}

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
    </CustomCard>
  );
};

export default TicketForm;
