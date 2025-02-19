import React from 'react';

const CustomCard = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-lg  mt-20 shadow-md max-w-2xl mx-auto">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {Icon && <Icon className="text-yellow-500" />}
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div> 
  );
};

export default CustomCard;
