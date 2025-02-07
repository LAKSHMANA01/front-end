import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, CheckCircle } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simulated API call
    setUser({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      address: '123 Main St, City',
      avatar: '/api/placeholder/150/150'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-6">Your Profile</h1>
          <div className="relative inline-block group">
            <img 
              src={user?.avatar} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300"
              alt="Profile"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-lg">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex gap-2 justify-center">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-white text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    value={user?.name}
                    onChange={e => setUser({...user, name: e.target.value})}
                    icon={<User className="w-4 h-4" />}
                  />
                  <InputField
                    label="Email"
                    type="email"
                    value={user?.email}
                    onChange={e => setUser({...user, email: e.target.value})}
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <InputField
                    label="Phone"
                    type="tel"
                    value={user?.phone}
                    onChange={e => setUser({...user, phone: e.target.value})}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <InputField
                    label="Address"
                    value={user?.address}
                    onChange={e => setUser({...user, address: e.target.value})}
                    icon={<MapPin className="w-4 h-4" />}
                  />
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

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      className="w-full px-4 py-3 rounded-lg border bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      {...props}
    />
  </div>
);

const SubmitButton = ({ success }) => (
  <div className="relative">
    <button
      type="submit"
      className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
        success ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        {success && <CheckCircle className="w-5 h-5" />}
        {success ? 'Profile Updated!' : 'Save Changes'}
      </span>
    </button>
  </div>
);

export default UserProfile;