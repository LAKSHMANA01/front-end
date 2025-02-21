import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
} from "lucide-react"; // Add the necessary icons

const DashboardCard = ({
  icon,
  title,
  value,
  trend = 0,
  percentage = null,
  status = "neutral",
  timeFrame = "vs last month",
  onClick,
}) => {
  // Determine the color based on the status
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-amber-600";
      case "danger":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  // Larger icon sizes
  const iconSize = 32; // Increase icon size for better prominence

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
    >
      {/* Icon and trend section */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-lg ${getStatusColor()} bg-opacity-20`}>
          {/* Display large icons */}
          <div className="flex justify-center">
            {React.cloneElement(icon, {
              size: iconSize,
              className: `${getStatusColor()}`,
            })}
          </div>
        </div>
        {/* {percentage !== null && (
          <div
            className={`flex items-center space-x-1 
            ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend >= 0 ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
            <span className="text-sm font-semibold">{Math.abs(percentage)}%</span>
          </div>
        )} */}
      </div>

      {/* Card content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </h3>
        <div className="flex items-end space-x-2">
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {value}
          </p>
          {trend !== 0 && (
            <span
              className={`text-sm pb-1 ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
