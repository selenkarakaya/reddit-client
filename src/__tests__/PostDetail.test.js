import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import PostDetail from "../components/PostDetail";
import * as postsSlice from "../features/posts/postsSlice";
import * as commentsSlice from "../features/comments/commentsSlice";

const mockStore = configureMockStore([]);

// Mock Redux actions
jest.mock("../features/posts/postsSlice", () => ({
  fetchPosts: jest.fn(() => ({ type: "posts/fetchPosts" })),
}));
jest.mock("../features/comments/commentsSlice", () => ({
  fetchComments: jest.fn(() => ({ type: "comments/fetchComments" })),
}));

function renderWithProviders(store, route = "/r/javascript/12345") {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/r/:subreddit/:postId" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("PostDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ data: { icon_img: "", name: "johndoe" } }),
      })
    );
  });

  test("renders loading spinner if post not loaded", async () => {
    const store = mockStore({
      posts: { items: [], status: "idle" },
      comments: { items: [], status: "idle" },
    });

    await act(async () => {
      renderWithProviders(store);
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(postsSlice.fetchPosts).toHaveBeenCalled();
  });

  test("renders posts and comments", async () => {
    const post = {
      id: "12345",
      title: "Test Post",
      author: "johndoe",
      permalink: "/r/javascript/comments/12345/test-post",
    };

    const store = mockStore({
      posts: { items: [post], status: "succeeded" },
      comments: {
        items: [{ id: "c1", body: "Nice post!" }],
        status: "succeeded",
      },
    });

    await act(async () => {
      renderWithProviders(store);
    });

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("Nice post!")).toBeInTheDocument();
    expect(commentsSlice.fetchComments).toHaveBeenCalledWith(post.permalink);
  });

  test("renders error message if comments fail", async () => {
    const post = {
      id: "12345",
      title: "Test Post",
      author: "johndoe",
      permalink: "/r/javascript/comments/12345/test-post",
    };

    const store = mockStore({
      posts: { items: [post], status: "succeeded" },
      comments: { items: [], status: "failed" },
    });

    await act(async () => {
      renderWithProviders(store);
    });

    await waitFor(() => {
      expect(screen.getByText("Error loading comments")).toBeInTheDocument();
    });
  });
});
