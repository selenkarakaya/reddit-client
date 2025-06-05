import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { searchPosts } from "../features/posts/postsSlice";
import { IoSearchCircleSharp } from "react-icons/io5";

function SearchBar() {
  const [term, setTerm] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    const trimmed = term.trim();
    if (!trimmed) return;

    dispatch(searchPosts(trimmed));
    setTerm("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full max-w-lg bg-white border border-gray-300 rounded-2xl shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
      <label htmlFor="search-input" className="sr-only">
        Search posts
      </label>
      <input
        type="text"
        placeholder="Search..."
        aria-label="Search posts"
        className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSearch}
        className="text-blue-500 text-2xl hover:scale-110 transition"
        aria-label="Search button"
        title="Search"
      >
        <IoSearchCircleSharp />
      </button>
    </div>
  );
}

export default SearchBar;
