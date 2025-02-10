import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const EngineerDashboard = () => {
  // Static dummy data for tickets and hazards
  const [tickets, setTickets] = useState([
    { id: 1, title: 'Fix Server Issue', description: 'Server is down', status: 'pending', location: [51.505, -0.09] },
    { id: 2, title: 'Network Upgrade', description: 'Upgrade network infrastructure', status: 'accepted', location: [51.515, -0.1] },
  ]);

  const [hazards, setHazards] = useState([
    { id: 1, title: 'Electrical Hazard', description: 'Exposed wires in server room' },
    { id: 2, title: 'Fire Hazard', description: 'Flammable materials near servers' },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Engineer Dashboard</h1>

      {/* Assigned Tickets */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p className="text-sm text-gray-500">{ticket.status}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                Update Status
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Route Mapping */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Route Mapping</h2>
        <MapContainer center={[51.505, -0.09]} zoom={13} className="h-96">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {tickets.map((ticket) => (
            <Marker key={ticket.id} position={ticket.location}>
              <Popup>{ticket.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Hazard Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Hazard Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hazards.map((hazard) => (
            <div key={hazard.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{hazard.title}</h3>
              <p>{hazard.description}</p>
              <button className="bg-red-500 text-white px-2 py-2 rounded mt-2 gap-2">
                Delete Hazard
              </button>
              <button className="bg-green-500 text-white px-2 py-2 rounded mt-2">
               
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;