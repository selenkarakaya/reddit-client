import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setSelectedCategory } from "../features/posts/postsSlice";

const categories = [
  "popular",
  "reactjs",
  "javascript",
  "funny",
  "aww",
  "gaming",
];

function CategoriesFilter() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.posts.selectedCategory);

  const handleCategoryClick = (category) => {
    if (category === selectedCategory) return; //Do not fetch if the same category is clicked
    dispatch(setSelectedCategory(category));
    dispatch(fetchPosts(category));
  };

  return (
    <div className="flex flex-col space-y-2 my-4 items-start">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 py-2 rounded transition
            ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-blue-300 text-gray-800 hover:bg-blue-400"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoriesFilter;
