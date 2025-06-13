import React from "react";
import { render, screen } from "@testing-library/react";
import PostItem from "../components/PostItem";
import * as timeAgoUtil from "../utils/timeAgo";
import PostButtons from "../components/PostButtons";

jest.mock("../components/PostButtons", () => () => (
  <div data-testid="post-buttons" />
));

describe("PostItem component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders author, time ago, and title", () => {
    jest.spyOn(timeAgoUtil, "timeAgo").mockReturnValue("2 hours ago");

    const post = {
      author: "testuser",
      created_utc: 1234567890,
      title: "Test Post Title",
      post_hint: "self",
      url: null,
    };

    render(<PostItem post={post} />);

    expect(screen.getByText("testuser •")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument(); // resim olmamalı
    expect(screen.getByTestId("post-buttons")).toBeInTheDocument();
  });

  test("renders image when post_hint is image and url is provided", () => {
    jest.spyOn(timeAgoUtil, "timeAgo").mockReturnValue("just now");

    const post = {
      author: "imageuser",
      created_utc: 987654321,
      title: "Image Post",
      post_hint: "image",
      url: "https://example.com/image.jpg",
    };

    render(<PostItem post={post} />);

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(img).toHaveAttribute("alt", "Image Post");
  });

  test("does not render image when post_hint is image but url is missing", () => {
    jest.spyOn(timeAgoUtil, "timeAgo").mockReturnValue("just now");

    const post = {
      author: "imageuser",
      created_utc: 987654321,
      title: "No Image URL Post",
      post_hint: "image",
      url: null,
    };

    render(<PostItem post={post} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
