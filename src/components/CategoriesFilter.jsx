import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setSelectedCategory } from "../features/posts/postsSlice";
import useWindowWidth from "../utils/useWindowWidth";

const categories = [
  "Home",
  "AskReddit",
  "NoStupidQuestions",
  "BaldursGate3",
  "facepalm",
  "Damnthatsinteresting",
  "LivestreamFail",
  "pics",
  "Palworld",
  "AmItheAsshole",
  "mildlyinfuriating",
  "Piracy",
  "PeterExplainsTheJoke",
  "funny",
  "AITAH",
  "movies",
  "Helldivers",
  "gaming",
  "worldnews",
  "leagueoflegends",
  "pcmasterrace",
  "Unexpected",
  "news",
  "politics",
];

function CategoriesFilter() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.posts.selectedCategory);
  const [showAll, setShowAll] = useState(false);
  const width = useWindowWidth();

  const handleCategoryClick = (category) => {
    const subreddit = category === "Home" ? "popular" : category;
    if (category === selectedCategory) return; //Do not fetch if the same category is clicked
    dispatch(setSelectedCategory(category));
    dispatch(fetchPosts(subreddit));
  };

  // If screen width is equal or greater than 1024 , display 10 subreddits otherwise display 5 subreddits
  const defaultVisibleCount = width >= 1024 ? 10 : 5;
  const visibleCategories = showAll
    ? categories
    : categories.slice(0, defaultVisibleCount);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-4 my-4 w-full">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Browse Subreddits
      </h2>
      <div className="flex lg:flex-col flex-wrap gap-2 pr-1">
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded transition text-sm
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-blue-300 text-gray-800 hover:bg-blue-400"
              }`}
          >
            {category}
          </button>
        ))}
        {/* Show More / Less Toggle Button */}
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 text-sm"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
}

export default CategoriesFilter;
