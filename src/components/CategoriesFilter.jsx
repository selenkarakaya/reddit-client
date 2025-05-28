import React from "react";
import { useDispatch } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";

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

  const handleCategoryClick = (category) => {
    dispatch(fetchPosts(category));
  };

  return (
    <div className="flex flex-col space-y-2 my-4 items-start">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoriesFilter;
