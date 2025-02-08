import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/Slice/AdminSlice";
import AdminNavbar from "./NavBar";

const AdminUserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers()); // Fetch users when component mounts
  }, [dispatch]);

  if (loading) return <p className="text-center text-lg">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
        < AdminNavbar/>
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users?.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="bg-white shadow-lg rounded-xl p-5 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-lg font-semibold">
                  {user.name.charAt(0).toUpperCase()} {/* Show first letter */}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 text-sm"><strong>Role:</strong> {user.role || "User"}</p>
                <p className="text-gray-600 text-sm"><strong>Status:</strong> {user.status || "Active"}</p>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                View Profile
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No users found</p>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;
