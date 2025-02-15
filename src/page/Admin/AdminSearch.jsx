import React from "react";
import SearchBar from "../../compoents/Searchbar";

const AdminSearch = ({ onSearch, onFilterChange }) => {
  return (
    <SearchBar
      onSearch={onSearch}
      filters={{ priority: true, status: true, specialization: true }}
      onFilterChange={onFilterChange}
    />
  );
};

export default AdminSearch;
