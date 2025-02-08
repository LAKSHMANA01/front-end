import React from "react";

const Card = ({ icon, title, value, onClick }) => {
  return (
    <div
      className="bg-white text-dark p-4 shadow-md items-center space-x-5 dark:text-red-400 cursor-pointer hover:shadow-lg transition duration-200"
      onClick={onClick} // ✅ Make entire card clickable
    >
      <div className="text-2xl text-gray-500">{icon}</div>
      <div className="text-lg font-semibold">
        <h2>{title}</h2>
        <p className="text-xl">{value}</p>
      </div>
    </div>
  );
};

export default Card;
