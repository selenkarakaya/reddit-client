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
    // <div>
    //   <h2>{post.title}</h2>
    //   <p>By: {post.author}</p>
    //   <p>{post.selftext}</p>
    //   <h3>Comments</h3>

    //   {commentsStatus === "failed" && <p>Error loading comments</p>}
    //   {comments.map((comment) => (
    //     <div
    //       key={comment.id}
    //       style={{ marginBottom: "10px", borderBottom: "1px solid #ddd" }}
    //     >
    //       {post.post_hint === "image" && post.url && (
    //         <img
    //           src={post.url}
    //           alt={post.title}
    //           className="my-4 rounded shadow"
    //         />
    //       )}
    //       <p>
    //         <strong>{comment.author}</strong>: {comment.body}
    //       </p>
    //       <p>Posted: {timeAgo(comment.created_utc)}</p>
    //     </div>
    //   ))}
    // </div>
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-900 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-4">By: {post.author}</p>
      {post.selftext && <p className="mb-4">{post.selftext}</p>}
      {post.post_hint === "image" && post.url && (
        <img src={post.url} alt={post.title} className="rounded mb-4" />
      )}
      <h3 className="text-xl font-semibold mb-2">Comments</h3>
      {commentsStatus === "failed" && <p>Error loading comments</p>}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded"
          >
            <p className="font-semibold">{comment.author}</p>
            <p className="text-sm">{comment.body}</p>
            <p className="text-xs text-gray-500">
              Posted: {timeAgo(comment.created_utc)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
