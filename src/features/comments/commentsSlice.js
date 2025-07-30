import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (permalink) => {
    const response = await fetch(
      `/.netlify/functions/redditProxy?permalink=${encodeURIComponent(
        permalink
      )}`
    );

    if (!response.ok) throw new Error("Failed to fetch comments");
    const data = await response.json();

    return data[1].data.children.map((child) => child.data);
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default commentsSlice.reducer;
