import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: To fetch data from the Reddit API

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

    // Sadece posts dizisini dön
    return data.data.children.map((child) => child.data);
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [], // Posts will be stored here.
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },

  reducers: {
    // İstersen normal reducerlar buraya eklenebilir (şimdilik ihtiyacımız yok)
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
      });
  },
});

export default postsSlice.reducer;
