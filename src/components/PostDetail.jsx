import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../features/comments/commentsSlice";
import { fetchPosts } from "../features/posts/postsSlice";
import LoadingSpinner from "./LoadingSpinner";
import AuthorInfo from "./AuthorInfo";
import PostItem from "./PostItem";
import PostComments from "./PostComments";

const PostDetail = () => {
  const { subreddit, postId } = useParams();
  const dispatch = useDispatch();

  const post = useSelector((state) =>
    state.posts.items.find((p) => p.id === postId)
  );

  const comments = useSelector((state) => state.comments.items);
  const commentsStatus = useSelector((state) => state.comments.status);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPosts(subreddit));
    }
    if (post) {
      dispatch(fetchComments(post.permalink));
    }
  }, [dispatch, subreddit, post, postId]);

  if (!post || commentsStatus === "loading") {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto flex gap-6">
      <div className="flex-1 px-4 py-6  my-4 borderCSS">
        <div className="flex-1 p-4">
          <PostItem post={post} />
          {/* Comments Section */}
          <h3 className="text-lg font-bold mt-6 mb-2">Comments</h3>

          {commentsStatus === "failed" && <p>Error loading comments</p>}
          <div className="space-y-3">
            {comments.map((comment) => (
              <PostComments key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
      <div className="hidden md:block ">
        {post?.author && <AuthorInfo author={post.author} />}
      </div>
    </div>
  );
};

export default PostDetail;
