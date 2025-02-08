import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEngineers } from "../../redux/Slice/AdminSlice";
import { Link } from "react-router-dom"; // ✅ Import Link
import AdminNavbar from "./NavBar";
import Card from "../../compoents/Card";

const AdminEngineerList = () => {
  const dispatch = useDispatch();
  const { engineers, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllEngineers());
  }, [dispatch]);

  if (loading) return <div className="text-center text-gray-500">Loading engineers...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!engineers || engineers.length === 0) return <p className="text-center text-gray-500">No engineers available.</p>;

  return (
    <div className="space-y-6 p-4">
      <AdminNavbar />
      {engineers.map((engineer) => (
        <div key={engineer.id} className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold">
            <Link to={`/admin/engineer/${engineer.id}`} className="text-blue-600 hover:underline">
              {engineer.name}
            </Link>
          </h2>
          <p className="text-gray-500">Email: {engineer.email}</p>
          <p className="text-gray-500">Phone: {engineer.phone}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminEngineerList;
