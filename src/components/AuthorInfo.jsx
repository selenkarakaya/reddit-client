// components/AuthorInfo.jsx
import React, { useEffect, useState } from "react";
import { IoLogoReddit } from "react-icons/io5";
import { timeAgo } from "../utils/timeAgo";

const AuthorInfo = ({ author }) => {
  const [authorInfo, setAuthorInfo] = useState(null);
  const [authorError, setAuthorError] = useState(null);
  const [trophies, setTrophies] = useState([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!author) return;

    fetch(`https://www.reddit.com/user/${author}/about.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch author info");
        return res.json();
      })
      .then((data) => setAuthorInfo(data.data))
      .catch((err) => {
        setAuthorError("Could not load author info");
      });
  }, [author]);

  useEffect(() => {
    if (!author) return;

    fetch(`https://www.reddit.com/user/${author}/trophies.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch trophies");
        return res.json();
      })
      .then((data) => {
        if (!data?.data?.trophies) return;
        const trophiesData = data.data.trophies.map((t) => t.data);

        setTrophies(trophiesData);
      })
      .catch((err) => {
        console.error("Error loading trophies:", err);
      });
  }, [author]);

  if (authorError) return <p className="text-red-500">{authorError}</p>;
  if (!authorInfo) return null;

  return (
    <div className="mt-4 p-6 border rounded bg-gray-50">
      <div className="items-center gap-2">
        {!imageError && authorInfo?.icon_img ? (
          <img
            src={authorInfo.icon_img}
            alt={`${author}'s avatar`}
            className="w-10 h-10 rounded-full"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl text-red-600">
            <IoLogoReddit />
          </div>
        )}
        <p className="font-semibold">u/{authorInfo.name}</p>
      </div>
      <p>{authorInfo.subreddit?.public_description}</p>
      <p>{authorInfo.subreddit?.title}</p>
      {/* <p className="text-xs text-gray-500">
        Karma: {authorInfo.total_karma.toLocaleString()} • Joined
        {timeAgo(authorInfo.created_utc)}
      </p> */}

      <p className="text-xs text-gray-500">
        Karma: {authorInfo.total_karma?.toLocaleString() ?? "N/A"} • Joined{" "}
        {authorInfo.created_utc ? timeAgo(authorInfo.created_utc) : ""}
      </p>

      {trophies?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Trophies</h4>
          <div className="flex flex-col flex-wrap gap-3">
            {trophies.map((trophy, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 p-2 rounded shadow-sm"
              >
                <img
                  src={trophy.icon_40}
                  alt={trophy.name}
                  className="w-6 h-6"
                  loading="lazy"
                />
                <span className="text-sm">{trophy.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
