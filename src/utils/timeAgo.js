export const timeAgo = (createdUtc) => {
  const now = Date.now();
  const postTime = createdUtc * 1000;
  const diff = now - postTime;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks >= 1) {
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
