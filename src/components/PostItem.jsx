import React from "react";
import { Link } from "react-router-dom";

const PostItem = ({ post }) => {
  const timeAgo = (createdUtc) => {
    const now = Date.now(); //JS Date gives time in milliseconds
    const postTime = createdUtc * 1000; // post.created_utc gives the time in seconds, convert it to milliseconds for JS Date
    const diff = now - postTime; // this is milliseconds

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks >= 1) {
      // If it’s more than 1 week ago, display the full date (e.g., 2025-05-28)
      const date = new Date(postTime);
      return date.toLocaleDateString();
    } else if (days >= 1) {
      return days + (days === 1 ? " day ago" : " days ago");
    } else if (hours >= 1) {
      return hours + (hours === 1 ? " hour ago" : " hours ago");
    } else if (minutes >= 1) {
      return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    } else {
      return "Just now";
    }
  };
  return (
    <div
      className="post-item"
      style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
    >
      <h3>{post.title}</h3>
      <p>Author: {post.author}</p>
      <p>{post.score}</p>
      <p>Posted: {timeAgo(post.created_utc)}</p>
      <Link to={`/post/${post.subreddit}/${post.id}`}>View Details</Link>
    </div>
  );
};

export default PostItem;
