import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";

/* MOCK THE REACT-REDUX MODULE
 *🧠 Why? In the test, we don't want to connect to the real Redux store; we only want to check whether dispatch was called or not.
 */
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(), // Returns a new empty function (mock) each time it is called.
}));

/*
Mock the searchPosts thunk function because the search operation in postsSlice is performed using this function. 
What the function actually does is not important in this test; we're only checking whether the dispatch action is triggered or not.

*/
jest.mock("../features/posts/postsSlice", () => ({
  searchPosts: jest.fn((term) => ({
    type: "posts/searchPosts",
    payload: term,
  })),
}));

describe("SearchBar component", () => {
  //Fake dispatch function
  let dispatchMock;

  //Code to run before each test
  beforeEach(() => {
    // Update the useDispatch mock
    const reactRedux = require("react-redux");
    dispatchMock = jest.fn();
    reactRedux.useDispatch = () => dispatchMock;
  });

  //We clear everything to avoid conflicts between mocks.
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dispatches searchPosts when Enter is pressed", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, "reactjs{enter}");

    //Is there an action object dispatched that has a type field equal to posts/searchPosts?
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "posts/searchPosts" })
    );
  });

  test("dispatches searchPosts when search button clicked", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, "frontend");

    const button = screen.getByRole("button", { name: /search button/i });
    await userEvent.click(button);

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "posts/searchPosts" })
    );
  });

  test("does not dispatch when input is empty and Enter is pressed", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    await userEvent.type(input, "{enter}");

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  test("does not dispatch when input is empty and search button clicked", async () => {
    render(<SearchBar />);
    const button = screen.getByRole("button", { name: /search button/i });
    await userEvent.click(button);

    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
