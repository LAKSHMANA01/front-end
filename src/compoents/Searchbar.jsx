// import React, { useState } from "react";

// const SearchBar = ({ onSearch, filters, onFilterChange }) => {
//   const [query, setQuery] = useState("");

//   const handleSearch = (e) => {
//     setQuery(e.target.value);
//     onSearch(e.target.value);
//   };

//   return (
//     <div className="flex flex-wrap gap-4 mb-4">
//       <input
//         type="text"
//         placeholder="Search..."
//         value={query}
//         onChange={handleSearch}
//         className="p-2 border rounded-lg w-full sm:w-64"
//       />

//       {filters.priority && (
//         <select
//           className="p-2 border rounded-lg"
//           onChange={(e) => onFilterChange("priority", e.target.value)}
//         >
//           <option value="">All Priorities</option>
//           <option value="high">High</option>
//           <option value="medium">Medium</option>
//           <option value="low">Low</option>
//         </select>
//       )}

//       {filters.status && (
//         <select
//           className="p-2 border rounded-lg"
//           onChange={(e) => onFilterChange("status", e.target.value)}
//         >
//           <option value="">All Statuses</option>
//           <option value="open">Open</option>
//           <option value="in-progress">In Progress</option>
//           <option value="deferred">Deferred</option>
//           <option value="failed">Failed</option>
//           <option value="completed">Completed</option>
//         </select>
//       )}

//       {filters.specialization && (
//         <select
//           className="p-2 border rounded-lg"
//           onChange={(e) => onFilterChange("specialization", e.target.value)}
//         >
//           <option value="">All Specializations</option>
//           <option value="Installation">Installation</option>
//           <option value="Fault">Fault</option>
//         </select>
//       )}
//     </div>
//   );
// };

// export default SearchBar;


import React, { useState } from "react";

const SearchBar = ({ onSearch, filters, onFilterChange }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        className="p-2 border rounded-lg w-full sm:w-64"
      />

      {/* Filters - Right Side */}
      <div className="flex gap-2">
        {filters.priority && (
          <select
            className="p-2 border rounded-lg"
            onChange={(e) => onFilterChange("priority", e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        )}

        {filters.status && (
          <select
            className="p-2 border rounded-lg"
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="deferred">Deferred</option>
            <option value="failed">Failed</option>
            <option value="completed">Completed</option>
          </select>
        )}

        {filters.specialization && (
          <select
            className="p-2 border rounded-lg"
            onChange={(e) => onFilterChange("specialization", e.target.value)}
          >
            <option value="">All Specializations</option>
            <option value="Installation">Installation</option>
            <option value="Fault">Fault</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
