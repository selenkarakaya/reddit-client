import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../features/comments/commentsSlice"; // Yorumlar için slice
import { fetchPosts } from "../features/posts/postsSlice"; // Post detay için gerekebilir

const PostDetail = () => {
  const { subreddit, postId } = useParams();
  const dispatch = useDispatch();

  // Post detay için posts listesinden ya da ayrı store’dan çekebilirsin
  const post = useSelector((state) =>
    state.posts.items.find((p) => p.id === postId)
  );

  const comments = useSelector((state) => state.comments.items);
  const commentsStatus = useSelector((state) => state.comments.status);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPosts(subreddit)); // Eğer post listede yoksa ilgili subreddit'i çek
    }
    if (post) {
      dispatch(fetchComments(post.permalink));
    }
  }, [dispatch, subreddit, post, postId]);

  if (!post) return <div>Loading post...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>By: {post.author}</p>
      <p>{post.selftext}</p>

      <h3>Comments</h3>
      {commentsStatus === "loading" && <p>Loading comments...</p>}
      {commentsStatus === "failed" && <p>Error loading comments</p>}
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{ marginBottom: "10px", borderBottom: "1px solid #ddd" }}
        >
          <p>
            <strong>{comment.author}</strong>: {comment.body}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostDetail;
