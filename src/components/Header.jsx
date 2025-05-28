import React from "react";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <div className="flex justify-between">
      <h1> Reddit </h1>
      <SearchBar />
    </div>
  );
}

export default Header;
