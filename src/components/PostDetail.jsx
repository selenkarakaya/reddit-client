import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../features/comments/commentsSlice";
import { fetchPosts } from "../features/posts/postsSlice";
import LoadingSpinner from "./LoadingSpinner";
import { timeAgo } from "../utils/timeAgo";
import PostButtons from "./PostButtons";
import AuthorInfo from "./AuthorInfo";
import PostItem from "./PostItem";

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
              <div
                key={comment.id}
                className="p-3 bg-gray-100 dark:bg-gray-100 rounded"
              >
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{comment.author} • </p>
                  <p className="text-xs text-gray-500">
                    {timeAgo(comment.created_utc)}
                  </p>
                </div>
                <p className="text-sm">{comment.body}</p>
                {/* <p>{comment.score}</p> */}
              </div>
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
