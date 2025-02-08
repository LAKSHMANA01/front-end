import { useState, useEffect } from 'react';

const UserDashboard = () => {
 

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      {/* Header Section */}
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-900">
          <span className="text-blue-500">Telecom</span> Support Portal
        </h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-800 hover:bg-blue-200">
            <NotificationIcon />
            Notifications
          </button>
          <ProfileDropdown  />
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Ticket Creation Card */}
        <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">Create New Ticket</h2>
          <form  className="space-y-4">
            <input
              type="text"
              placeholder="Issue Title"
              className="w-full rounded-lg border p-3"
             
            />
            <textarea
              placeholder="Describe your issue..."
              className="w-full rounded-lg border p-3"
              rows="4"
             
            />
            <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700">
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Ticket List Section */}
        <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Tickets</h2>
            <div className="flex gap-2">
              <button className="rounded-lg bg-gray-100 px-4 py-2">All</button>
              <button className="rounded-lg bg-blue-100 px-4 py-2 text-blue-600">Open</button>
              <button className="rounded-lg bg-green-100 px-4 py-2 text-green-600">Resolved</button>
            </div>
          </div>
          <div className="space-y-4">
            {
              <div className="rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">fult</h3>
                    <p className="text-gray-600">thismay any this comes</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm ${ 'bg-gray-100 text-gray-600'}`}>
                    {'Unknown'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  {/* <CalendarIcon /> */}
                  <span></span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable UI Components
const NotificationIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ProfileDropdown = ({ user }) => (
  <div className="relative">
    <button className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2">
      <UserCircleIcon />
      <span className="font-medium">{user?.name || 'Guest'}</span>
    </button>
  </div>
);

const UserCircleIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const statusStyles = {
  open: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800'
};

export default UserDashboard;
