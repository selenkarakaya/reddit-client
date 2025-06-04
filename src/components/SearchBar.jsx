import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";
import { IoSearchCircleSharp } from "react-icons/io5";

function SearchBar() {
  const [term, setTerm] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (term.trim() !== "") {
      dispatch(fetchPosts(term.trim()));
      setTerm("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full max-w-lg bg-white border border-gray-300 rounded-2xl shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSearch}
        className="text-blue-500 text-2xl hover:scale-110 transition"
      >
        <IoSearchCircleSharp />
      </button>
    </div>
  );
}

export default SearchBar;
