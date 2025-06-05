import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "./postsSlice";
import PostItem from "../../components/PostItem";
import CategoriesFilter from "../../components/CategoriesFilter";
import LoadingSpinner from "../../components/LoadingSpinner";

const PostsList = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.items);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const searchTerm = useSelector((state) => state.posts.searchTerm);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  const filteredPosts = searchTerm
    ? posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.selftext?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col-reverse lg:flex-row gap-6">
        {/* Posts section */}
        <div className="w-full lg:w-3/4">
          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-500">No posts found.</p>
          )}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        </div>
        {/* Categories / Subreddits */}
        <aside className="w-full lg:w-1/4">
          <CategoriesFilter />
        </aside>
      </div>
    </div>
  );
};

export default PostsList;
