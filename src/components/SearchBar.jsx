import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";

function SearchBar() {
  const [term, setTerm] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (term.trim() !== "") {
      dispatch(fetchPosts(term.trim()));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full max-w-md mx-auto bg-white border border-gray-300 rounded-2xl shadow-sm p-2 focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-4 py-2 bg-transparent outline-none text-gray-800 placeholder-gray-400"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search icon</button>
    </div>
  );
}

export default SearchBar;
