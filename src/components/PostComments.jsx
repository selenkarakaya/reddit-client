import React from "react";
import { timeAgo } from "../utils/timeAgo";
function PostComments({ comment }) {
  return (
    <div key={comment.id} className="p-3 bg-gray-100 dark:bg-gray-100 rounded">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{comment.author} • </p>
        <p className="text-xs text-gray-500">{timeAgo(comment.created_utc)}</p>
      </div>
      <p className="text-sm">{comment.body}</p>
      {/* <p>{comment.score}</p> */}
    </div>
  );
}

export default PostComments;
