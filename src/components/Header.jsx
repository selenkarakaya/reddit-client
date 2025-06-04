import React from "react";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-around p-4 gap-4  w-full">
      <Link to={"/"} className="text-2xl font-bold text-blue-950">
        <strong className="text-blue-950">Reddit</strong>
        <span className="text-gray-700">Minimal</span>
      </Link>
      <SearchBar />
    </div>
  );
}

export default Header;
