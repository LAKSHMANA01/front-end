import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllApprovedEngineers } from "../../redux/Slice/AdminSlice";
import { useNavigate } from "react-router-dom"; 
import AdminNavbar from "./NavBar";
import Card from "../../compoents/Card";
import Loading from "../../compoents/Loadingpage"

const AdminEngineerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { approvedEngineers = [], loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllApprovedEngineers());
  }, [dispatch]);

  if (loading) return <div className="text-center text-gray-500"><Loading/></div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (approvedEngineers.length === 0) return <p className="text-center text-gray-500">No engineers available.</p>;

  return (
    <div className="space-y-6 p-4">
      <AdminNavbar />
      {approvedEngineers.map((engineer) => (
        <div
          key={engineer._id}
          className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg"
          onClick={() => navigate(`/admin/engineer/${engineer.email}`)} // ✅ Navigate on click
        >
          <h2 className="text-lg font-semibold">{engineer.name}</h2>
          <p className="text-gray-500">Email: {engineer.email}</p>
          <p className="text-gray-500">Phone: {engineer.phone}</p>
          <p className="text-gray-500">specialization: {engineer.specialization}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminEngineerList;
