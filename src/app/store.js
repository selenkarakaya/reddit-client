// First, we will create the Redux store so that we can manage the global state in the application.

import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import commentsReducer from "../features/comments/commentsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer, // We are adding the posts slice to the store
    comments: commentsReducer, // We are adding the comments slice to the store
  },
});
