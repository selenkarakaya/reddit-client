const axios = require("axios");

exports.handler = async function (event) {
  const { subreddit, q, permalink } = event.queryStringParameters || {};

  let url = "";

  if (permalink) {
    url = `https://www.reddit.com${permalink}.json`;
  } else if (subreddit === "search" && q) {
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
    console.error(
      "Proxy error:",
      error.response?.status,
      error.response?.data || error.message
    );

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data || null,
      }),
    };
  }
};
