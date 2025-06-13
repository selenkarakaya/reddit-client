import { configureStore } from "@reduxjs/toolkit";
import postsReducer, {
  fetchPosts,
  searchPosts,
} from "../features/posts/postsSlice";
import thunk from "redux-thunk";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("postsSlice async thunks", () => {
  let store;

  beforeEach(() => {
    fetch.resetMocks();
    store = configureStore({
      reducer: {
        posts: postsReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  });

  test("fetchPosts dispatches fulfilled action and stores data", async () => {
    const mockData = {
      data: {
        children: [
          { data: { id: "1", title: "Post 1" } },
          { data: { id: "2", title: "Post 2" } },
        ],
      },
    };

    fetch.mockResponseOnce(JSON.stringify(mockData));

    await store.dispatch(fetchPosts("popular"));

    const state = store.getState().posts;

    expect(state.status).toBe("succeeded");
    expect(state.items).toHaveLength(2);
    expect(state.items[0].title).toBe("Post 1");
  });

  test("searchPosts dispatches fulfilled action and stores search results", async () => {
    const mockSearchData = {
      data: {
        children: [
          { data: { id: "3", title: "Search Result 1" } },
          { data: { id: "4", title: "Search Result 2" } },
        ],
      },
    };

    fetch.mockResponseOnce(JSON.stringify(mockSearchData));

    await store.dispatch(searchPosts("react"));

    const state = store.getState().posts;

    expect(state.status).toBe("succeeded");
    expect(state.items[0].title).toBe("Search Result 1");
  });

  test("fetchPosts dispatches rejected action on fetch error", async () => {
    fetch.mockRejectOnce(new Error("API failure"));

    await store.dispatch(fetchPosts("popular"));

    const state = store.getState().posts;

    expect(state.status).toBe("failed");
    expect(state.error).toBeDefined();
  });

  test("searchPosts dispatches rejected action on fetch error", async () => {
    fetch.mockRejectOnce(new Error("Search failed"));

    await store.dispatch(searchPosts("error"));

    const state = store.getState().posts;

    expect(state.status).toBe("failed");
    expect(state.error).toBeDefined();
  });
});
