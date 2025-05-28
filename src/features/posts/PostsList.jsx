import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "./postsSlice";
import PostItem from "../../components/PostItem";
import CategoriesFilter from "../../components/CategoriesFilter";

const PostsList = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.items);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <p>Loading posts...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex justify-between">
      <div>
        <h1>postlar</h1>
        {posts.length === 0 && <p>No posts found.</p>}
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      <CategoriesFilter />
    </div>
  );
};

export default PostsList;
