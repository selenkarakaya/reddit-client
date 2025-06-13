// src/__tests__/PostComments.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import PostComments from "../components/PostComments";

jest.mock("../utils/timeAgo", () => ({
  timeAgo: jest.fn(() => "2 hours ago"),
}));

describe("PostComments", () => {
  const comment = {
    id: "abc123",
    author: "testuser",
    created_utc: 1650000000,
    body: "This is a test comment",
  };

  test("renders comment author, body and formatted time", () => {
    render(<PostComments comment={comment} />);

    expect(screen.getByText(/testuser/i)).toBeInTheDocument();

    expect(screen.getByText(/This is a test comment/i)).toBeInTheDocument();

    expect(screen.getByText(/2 hours ago/i)).toBeInTheDocument();
  });
});
