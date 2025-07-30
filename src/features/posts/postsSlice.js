import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: To fetch subreddit data from the Reddit API

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (subreddit = "popular") => {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/.json`);
    if (!response.ok) {
      const error = await response.json();
      const message = `An error has occured: ${response.status} ${error.message}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data.data.children.map((child) => child.data);
  }
);

// Async thunk: To fetch posts via search term
export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (term) => {
    const response = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(term)}`
    );
    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();
    return data.data.children.map((child) => child.data);
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [], // Posts will be stored here.
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    selectedCategory: "popular",
    searchTerm: "",
  },

  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSelectedCategory, setSearchTerm } = postsSlice.actions;
export default postsSlice.reducer;
