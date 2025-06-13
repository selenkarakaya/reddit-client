import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostsList from "../features/posts/PostsList";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../features/posts/postsSlice", () => ({
  fetchPosts: jest.fn(() => ({ type: "posts/fetchPosts" })),
}));

describe("PostsList component", () => {
  const { useDispatch, useSelector } = require("react-redux");
  const dispatchMock = jest.fn();
  const useSelectorMock = useSelector;

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
    useSelectorMock.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("dispatches fetchPosts when the component first mounts or when the status is idle", async () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({
        posts: {
          items: [],
          status: "idle",
          error: null,
          searchTerm: "",
        },
      })
    );
    render(<PostsList />);

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "posts/fetchPosts" })
    );
  });

  test("shows loading spinner when status is loading", () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({
        posts: { items: [], status: "loading", error: null, searchTerm: "" },
      })
    );
    render(<PostsList />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("shows error message when status is failed", () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({
        posts: {
          items: [],
          status: "failed",
          error: "some error",
          searchTerm: "",
        },
      })
    );
    render(<PostsList />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText(/error: some error/i)).toBeInTheDocument();
  });

  test("renders posts when status is succeeded", () => {
    const posts = [
      { id: "1", title: "First Post", selftext: "Text1" },
      { id: "2", title: "Second Post", selftext: "Text2" },
    ];

    useSelectorMock.mockImplementation((selector) =>
      selector({
        posts: {
          items: posts,
          status: "succeeded",
          error: null,
          searchTerm: "",
        },
      })
    );

    /*the component contains a <Link> element from React Router, 
    we wrapped it with MemoryRouter in the test to provide the necessary routing context.
    */
    render(
      <MemoryRouter>
        <PostsList />
      </MemoryRouter>
    );

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  test("filters posts based on searchTerm", () => {
    const posts = [
      { id: "1", title: "React Testing", selftext: "Learn testing" },
      { id: "2", title: "Redux Toolkit", selftext: "Manage state" },
      { id: "3", title: "useContext", selftext: "Manage state" },
    ];

    useSelectorMock.mockImplementation((selector) =>
      selector({
        posts: {
          items: posts,
          status: "succeeded",
          error: null,
          searchTerm: "redux",
        },
      })
    );

    render(
      <MemoryRouter>
        <PostsList />
      </MemoryRouter>
    );

    expect(screen.queryByText("React Testing")).not.toBeInTheDocument();
    expect(screen.getByText("Redux Toolkit")).toBeInTheDocument();
    expect(screen.queryByText("useContext")).not.toBeInTheDocument();
  });

  test("shows no posts found message when filteredPosts is empty", () => {
    const posts = [
      { id: "1", title: "React Testing", selftext: "Learn testing" },
    ];

    useSelectorMock.mockImplementation((selector) =>
      selector({
        posts: {
          items: posts,
          status: "succeeded",
          error: null,
          searchTerm: "angular",
        },
      })
    );

    render(
      <MemoryRouter>
        <PostsList />
      </MemoryRouter>
    );

    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
  });
});
