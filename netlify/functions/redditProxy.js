const axios = require("axios");

exports.handler = async function (event) {
  const { subreddit, q } = event.queryStringParameters || {};

  let url = "";
  if (subreddit === "search" && q) {
    url = `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}`;
  } else {
    url = `https://www.reddit.com/r/${subreddit || "popular"}.json`;
  }

  try {
    const response = await axios.get(url);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API error" }),
    };
  }
};
