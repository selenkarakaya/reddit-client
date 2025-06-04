import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { PiArrowFatDownBold, PiArrowFatUpBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { VscCommentDraft } from "react-icons/vsc";
import { TbShare3 } from "react-icons/tb";
import { FaCopy } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

function PostButtons({ post }) {
  const [score, setScore] = useState(post.score); // Track the current vote score
  const [vote, setVote] = useState(null); // Track user vote: 'up', 'down', or null
  const [showPopup, setShowPopup] = useState(false); // Toggle visibility of the share popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 }); // Position of the popup
  const shareBtnRef = useRef(null); // Reference to the share button element
  const [copiedVisible, setCopiedVisible] = useState(false); // ⬅️ New state for copied message

  // Handle vote button click (upvote or downvote)
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

  // Copy the post's URL to clipboard
  const handleCopyLink = (e) => {
    const url = `${window.location.origin}/post/${post.subreddit}/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowPopup(false);
      setCopiedVisible(true); // Show "Copied!" message
    });
    // Automatically hide after 3 seconds
    setTimeout(() => {
      setCopiedVisible(false);
    }, 3000);
  };

  const closeCopiedMessage = () => {
    setCopiedVisible(false);
  };

  // Toggle the visibility and position of the popup
  const togglePopup = () => {
    if (showPopup) {
      setShowPopup(false);
    } else {
      const rect = shareBtnRef.current.getBoundingClientRect();
      setPopupPosition({ top: rect.bottom + 5, left: rect.left });
      setShowPopup(true);
    }
  };

  // Close the popup when clicking outside the share button
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showPopup &&
        shareBtnRef.current &&
        !shareBtnRef.current.contains(e.target)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showPopup]);
  return (
    <div>
      <div className="flex justify-between my-3">
        {/* VOTE COLUMN */}
        <div className="flex items-center gap-1 bg-gray-200 rounded-4xl px-2 py-1.5">
          <motion.button
            whileTap={{ rotate: 15, scale: 2, x: 5, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => handleScore("up")}
            className={`transition ${vote === "up" ? "text-green-500" : ""}`}
          >
            <PiArrowFatUpBold />
          </motion.button>
          <p
            className={`transition text-sm ${
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
            <PiArrowFatDownBold />
          </motion.button>
        </div>
        {/* Comment button */}
        <Link
          to={`/post/${post.subreddit}/${post.id}`}
          className="flex justify-between items-center gap-2 bg-gray-200 rounded-4xl px-2 py-1.5 text-gray-600"
        >
          <VscCommentDraft />
          <span>{post.num_comments}</span>
        </Link>

        {/* Share Button */}
        <button
          ref={shareBtnRef}
          onClick={togglePopup}
          className="flex justify-between items-center gap-2  bg-gray-200 rounded-4xl px-2 py-1.5 text-gray-600"
          title="Share"
        >
          <TbShare3 />
          Share
        </button>
        {/* Share Popup */}
        {showPopup && (
          <div
            style={{
              position: "fixed",
              top: popupPosition.top,
              left: popupPosition.left,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-300 rounded shadow-md px-4 py-2"
          >
            <button
              onClick={handleCopyLink}
              className="text-xs md:text-sm flex justify-between items-center gap-2"
            >
              <FaCopy />
              Copy Link
            </button>
          </div>
        )}
        {/* ✅ Copied Message Box */}
        {copiedVisible && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-4xl shadow-lg flex items-center gap-2 z-[9999]">
            <span>Link copied!</span>
            <button onClick={closeCopiedMessage} className="text-red-500">
              <IoClose size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostButtons;
