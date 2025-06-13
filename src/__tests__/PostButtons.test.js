import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostButtons from "../components/PostButtons";
import { BrowserRouter as Router } from "react-router-dom";

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe("PostButtons component", () => {
  const post = {
    id: "abc123",
    subreddit: "testsub",
    score: 10,
    num_comments: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup() {
    return render(
      <Router>
        <PostButtons post={post} />
      </Router>
    );
  }

  test("renders initial score and comments count", () => {
    setup();

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    const commentLink = screen.getByRole("link");
    expect(commentLink).toHaveAttribute(
      "href",
      `/post/${post.subreddit}/${post.id}`
    );
  });

  test("upvote increases score and toggles correctly", () => {
    setup();

    const upvoteBtn = screen.getByLabelText("Upvote");
    const scoreText = screen.getByText("10");

    // Click upvote once -> score should increase by 1 (to 11)
    fireEvent.click(upvoteBtn);
    expect(scoreText.textContent).toBe("11");
    expect(upvoteBtn).toHaveAttribute("aria-pressed", "true");

    // Click upvote again (toggle off) -> score back to 10
    fireEvent.click(upvoteBtn);
    expect(scoreText.textContent).toBe("10");
    expect(upvoteBtn).toHaveAttribute("aria-pressed", "false");
  });

  test("downvote decreases score and toggles correctly", () => {
    setup();

    const downvoteBtn = screen.getByLabelText("Downvote");
    const scoreText = screen.getByText("10");

    // Click downvote once -> score should decrease by 1 (to 9)
    fireEvent.click(downvoteBtn);
    expect(scoreText.textContent).toBe("9");
    expect(downvoteBtn).toHaveAttribute("aria-pressed", "true");

    // Click downvote again (toggle off) -> score back to 10
    fireEvent.click(downvoteBtn);
    expect(scoreText.textContent).toBe("10");
    expect(downvoteBtn).toHaveAttribute("aria-pressed", "false");
  });

  test("switching vote from upvote to downvote updates score correctly", () => {
    setup();

    const upvoteBtn = screen.getByLabelText("Upvote");
    const downvoteBtn = screen.getByLabelText("Downvote");
    const scoreText = screen.getByText("10");

    // Upvote first
    fireEvent.click(upvoteBtn);
    expect(scoreText.textContent).toBe("11");

    // Switch to downvote -> should subtract 2 (from 11 to 9)
    fireEvent.click(downvoteBtn);
    expect(scoreText.textContent).toBe("9");
    expect(upvoteBtn).toHaveAttribute("aria-pressed", "false");
    expect(downvoteBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("share button toggles popup and copies link", async () => {
    setup();

    const shareBtn = screen.getByRole("button", { name: /share button/i });

    // Initially popup should not be visible
    expect(screen.queryByText(/copy link/i)).not.toBeInTheDocument();

    // Click share button opens popup
    fireEvent.click(shareBtn);
    expect(screen.getByText(/copy link/i)).toBeInTheDocument();

    // Click copy link triggers clipboard writeText and shows copied message
    const copyBtn = screen.getByRole("button", { name: /copy post link/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/post/${post.subreddit}/${post.id}`
    );

    // Copied message should appear
    expect(await screen.findByText(/link copied!/i)).toBeInTheDocument();

    // Close copied message by clicking close button
    const closeBtn = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByText(/link copied!/i)).not.toBeInTheDocument();
    });
  });

  test("popup closes when clicking outside", () => {
    setup();

    const shareBtn = screen.getByRole("button", { name: /share button/i });

    fireEvent.click(shareBtn);
    expect(screen.getByText(/copy link/i)).toBeInTheDocument();

    // Click outside (simulate clicking document body)
    fireEvent.click(document.body);

    expect(screen.queryByText(/copy link/i)).not.toBeInTheDocument();
  });
});
