import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEngineerTasks, fetchUpdateEngineerProfile } from '../../redux/Slice/EngineerSlice';
import EngineerNavbar from "./Navbar";

const EngineerProfile = () => {
  const engineerId = 3;
  const dispatch = useDispatch();

  const [engineer, setEngineer] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 987 654 3210",
    address: "456 Engineer St, City",
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await dispatch(fetchUpdateEngineerProfile(engineer));
      setSuccess(true);
    } catch (error) {
      console.error("Profile update failed:", error.message);
    }

    setTimeout(() => setSuccess(false), 3000);
  };

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "Update", label: "Update Profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
        <EngineerNavbar/>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-6">Engineer Profile</h1>
          <div className="relative inline-block group">
            <img
              src={engineer?.avatar || "/path/to/default-avatar.jpg"}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              alt="Profile"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full hover:bg-blue-600">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white text-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "personal" && (
              <div className="grid md:grid-cols-2 gap-6">
                <ProfileField label="Full Name" value={engineer.name} icon={<User className="w-4" />} />
                <ProfileField label="Email" value={engineer.email} icon={<Mail className="w-4" />} />
                <ProfileField label="Phone" value={engineer.phone} icon={<Phone className="w-4" />} />
                <ProfileField label="Address" value={engineer.address} icon={<MapPin className="w-4" />} />
              </div>
            )}

            {activeTab === "Update" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Full Name" value={engineer.name} onChange={(e) => setEngineer({ ...engineer, name: e.target.value })} icon={<User className="w-4" />} />
                  <InputField label="Email" type="email" value={engineer.email} onChange={(e) => setEngineer({ ...engineer, email: e.target.value })} icon={<Mail className="w-4" />} />
                  <InputField label="Phone" type="tel" value={engineer.phone} onChange={(e) => setEngineer({ ...engineer, phone: e.target.value })} icon={<Phone className="w-4" />} />
                  <InputField label="Address" value={engineer.address} onChange={(e) => setEngineer({ ...engineer, address: e.target.value })} icon={<MapPin className="w-4" />} />
                </div>
                <SubmitButton success={success} />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, icon }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon} {label}
    </label>
    <h3 className="w-full px-4 py-3 rounded-lg border bg-white/50">{value}</h3>
  </div>
);

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon} {label}
    </label>
    <input className="w-full px-4 py-3 rounded-lg border bg-white/50" {...props} />
  </div>
);

const SubmitButton = ({ success }) => (
  <div className="relative">
    <button type="submit" className={`w-40 py-2 rounded-lg font-medium text-white transition-all duration-300 ${success ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"}`}>
      <span className="flex items-center justify-center gap-2">
        {success && <CheckCircle className="w-5 h-5" />}
        {success ? "Profile Updated!" : "Save Changes"}
      </span>
    </button>
  </div>
);

export default EngineerProfile;
