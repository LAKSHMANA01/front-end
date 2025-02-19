// Modify Dashbord.jsx

import React from "react";
import {
  FaBox,
  FaMapPin,
  FaRegClock,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { dataBar, dataLine } from "../../assets/chartData";
import Card from "./Card";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {fetchProfile } from "../../redux/Slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Register ChartJS components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
);

// import { dataBar, dataLine } from "../assets/chartData";
// import { Line, Bar } from "react-chartjs-2";
// import { ThemeContext } from "../ContextAPI/ContextAPI";


const Dashbord = () => {
  const userEmail = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role"); 
  const dispatch = useDispatch();
const { profile } = useSelector((state) => state.tickets);

// Fetch the profile if not already loaded
useEffect(() => {
  if (!profile.email) {
    dispatch(fetchProfile({ userEmail, role }));
  }
}, [dispatch, profile.email, userEmail, role]);


  return (
    <>
      <div className=" grow p-8  dark:bg-gray-900 dark:text-white dark:border-gray-600">
        <h1 className="text-2xl mb-4 font-bold">DashBord</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={<FaUserCog />} title="Active Engineers" value="140" />
          <Card icon={<FaBox />} title="Completed Task" value="02" />
          <Card icon={<FaRegClock />} title="Pending task" value="20" />
          <Card icon={<FaMapPin />} title="Total Task" value="11" />
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 ">
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h3 className="text-gl font-semibold mb-4">Task Progress</h3>
            {/* <Line />   
 />*/}{" "}
            <Line data={dataLine} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h3 className="text-gl font-semibold mb-4">Team Performance</h3>
            <Bar data={dataBar} />
          </div>
        </div>
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
      </div>
    </>
  );
};
export default Dashbord;

// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// toast.success("Ticket submitted successfully!");
// toast.success("Ticket submitted successfully!");
