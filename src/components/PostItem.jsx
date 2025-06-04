import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { VscCommentDraft } from "react-icons/vsc";

const PostItem = ({ post }) => {
  const [score, setScore] = useState(post.score);
  const [vote, setVote] = useState(null); // 'up', 'down', or null

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

  const handleScore = (direction) => {
    // If the same direction is pressed again, remove the vote
    if (direction === vote) {
      setVote(null);
      setScore((prev) => (direction === "up" ? prev - 1 : prev + 1));
    }
    // The vote direction was changed or it's the first time voting
    else {
      if (vote === null) {
        // Voting for the first time
        setScore((prev) => (direction === "up" ? prev + 1 : prev - 1));
      }
      // Switched to the opposite direction (e.g., up → down)
      else {
        setScore((prev) => (direction === "up" ? prev + 2 : prev - 2));
      }
      setVote(direction);
    }
  };

  return (
    <div className="flex justify-between borderCSS">
      <div className="flex flex-col justify-center">
        <motion.button
          whileTap={{ rotate: 15, scale: 2, x: 5, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => handleScore("up")}
          className={`transition ${vote === "up" ? "text-green-500" : ""}`}
        >
          <FaAngleDoubleUp />
        </motion.button>
        <p
          className={`transition ${
            vote === "up"
              ? "text-green-500"
              : vote === "down"
              ? "text-red-500"
              : ""
          }`}
        >
          {score}
        </p>
        <motion.button
          whileTap={{ rotate: 15, scale: 2, x: 5, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => handleScore("down")}
          className={`transition transform active:scale-125 duration-150 ${
            vote === "down" ? "text-red-500" : ""
          }`}
        >
          <FaAngleDoubleDown />
        </motion.button>
      </div>
      <div
        className="post-item"
        style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
      >
        <h3>{post.title}</h3>
        {post.post_hint === "image" && post.url && (
          <img
            src={post.url}
            alt={post.title}
            className="my-2 max-w-full rounded shadow"
          />
        )}

        <p>Author: {post.author}</p>
        <p>Posted: {timeAgo(post.created_utc)}</p>
        <Link to={`/post/${post.subreddit}/${post.id}`}>
          <VscCommentDraft />
          <span>{post.num_comments}</span>
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
