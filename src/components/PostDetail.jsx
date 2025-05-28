import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../features/comments/commentsSlice";
import { fetchPosts } from "../features/posts/postsSlice";
import LoadingSpinner from "./LoadingSpinner";
import { timeAgo } from "../utils/timeAgo";

const PostDetail = () => {
  const { subreddit, postId } = useParams();
  const dispatch = useDispatch();

  // You can fetch the post details from the posts list or from a separate store
  const post = useSelector((state) =>
    state.posts.items.find((p) => p.id === postId)
  );

  const comments = useSelector((state) => state.comments.items);
  const commentsStatus = useSelector((state) => state.comments.status);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPosts(subreddit)); // If the post is not in the list, fetch the relevant subreddit
    }
    if (post) {
      dispatch(fetchComments(post.permalink));
    }
  }, [dispatch, subreddit, post, postId]);
  if (!post) {
    return <LoadingSpinner />;
  }
  if (commentsStatus === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>By: {post.author}</p>
      <p>{post.selftext}</p>
      <h3>Comments</h3>

      {commentsStatus === "failed" && <p>Error loading comments</p>}
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{ marginBottom: "10px", borderBottom: "1px solid #ddd" }}
        >
          <p>
            <strong>{comment.author}</strong>: {comment.body}
          </p>
          <p>Posted: {timeAgo(post.created_utc)}</p>
        </div>
      ))}
    </div>
  );
};

export default PostDetail;
