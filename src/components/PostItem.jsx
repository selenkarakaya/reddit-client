import React from "react";
import { timeAgo } from "../utils/timeAgo";
import PostButtons from "./PostButtons";

const PostItem = ({ post }) => {
  return (
    <div className="flex borderCSS hoverCSS">
      {/* CONTENT */}
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2">
          <p>{post.author} • </p>
          <p className="text-sm"> {timeAgo(post.created_utc)}</p>
        </div>
        <p className="text-lg">{post.title}</p>
        {post.post_hint === "image" && post.url && (
          <img
            src={post.url}
            alt={post.title}
            className="my-2 max-w-full rounded shadow"
            loading="lazy"
          />
        )}
        <div className="border-b-2 border-b-gray-200 w-full"></div>
        <PostButtons post={post} />
      </div>
    </div>
  );
};

export default PostItem;
