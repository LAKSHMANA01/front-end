// Modify Dashbord.jsx
import React from "react";
import { 
  FaBox, 
 
  FaMapPin, 
  FaRegClock,
  FaUserCog,
  FaUsers 
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
import { dataBar, dataLine } from "./../assets/chartData";
import Card from "./Card";

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

  
  return (
    <>
      <div className=" grow p-8  dark:bg-gray-900 dark:text-white dark:border-gray-600">
        <h1 className="text-2xl mb-4 font-bold">DashBord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <Card icon={< FaUserCog/>} title="Active Engineers" value="140" /> */}
          <Card icon={<FaBox />} title="Completed Task" value="02" />
          <Card icon={< FaRegClock />} title="pending task" value="110" />
          {/* <Card icon={< FaMapPin />} title="total sites" value="11" /> */}
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 " >
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h3 className="text-gl font-semibold mb-4">Task Progress</h3>
            <Line data={dataLine} /> 
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md ">
            <h3 className="text-gl font-semibold mb-4">Team Performance</h3>
            <Bar data={dataBar}/>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashbord;

