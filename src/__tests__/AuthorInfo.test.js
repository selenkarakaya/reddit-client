import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AuthorInfo from "../components/AuthorInfo";

// fetch'i jest ile mock'luyoruz
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test("does not render when no author prop provided", () => {
  const { container } = render(<AuthorInfo />);
  expect(container).toBeEmptyDOMElement();
});

test("renders author info after successful fetch", async () => {
  const mockAuthorData = {
    data: {
      name: "johndoe",
      icon_img: "https://avatar.url/image.png",
      subreddit: {
        public_description: "A developer",
        title: "John's subreddit",
      },
      total_karma: 1234,
      created_utc: Math.floor(Date.now() / 1000) - 10000, // 10k seconds ago
    },
  };

  const mockTrophiesData = {
    data: {
      trophies: [
        { data: { name: "Trophy 1", icon_40: "https://trophy1.png" } },
        { data: { name: "Trophy 2", icon_40: "https://trophy2.png" } },
      ],
    },
  };

  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthorData,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrophiesData,
    });

  render(<AuthorInfo author="johndoe" />);

  // Öncelikle fetch çağrıldığına emin ol
  expect(fetch).toHaveBeenCalledWith(
    "https://www.reddit.com/user/johndoe/about.json"
  );

  // authorInfo yüklenene kadar bekle
  await waitFor(() => {
    expect(screen.getByText(/u\/johndoe/i)).toBeInTheDocument();
  });

  // Avatar resmi
  expect(screen.getByAltText("johndoe's avatar")).toHaveAttribute(
    "src",
    "https://avatar.url/image.png"
  );

  // Subreddit açıklaması ve başlığı
  expect(screen.getByText("A developer")).toBeInTheDocument();
  expect(screen.getByText("John's subreddit")).toBeInTheDocument();

  // Karma (toLocaleString çıktısı kontrolü zor, bu yüzden sadece metnin içinde karma var mı kontrol edelim)
  expect(screen.getByText(/karma/i)).toBeInTheDocument();

  // Trophies
  expect(screen.getByText("Trophies")).toBeInTheDocument();
  expect(screen.getByText("Trophy 1")).toBeInTheDocument();
  expect(screen.getByAltText("Trophy 1")).toHaveAttribute(
    "src",
    "https://trophy1.png"
  );
  expect(screen.getByText("Trophy 2")).toBeInTheDocument();
});

test("renders error message when fetch fails", async () => {
  fetch
    .mockResolvedValueOnce({
      ok: false,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { trophies: [] } }),
    });

  render(<AuthorInfo author="erroruser" />);

  await waitFor(() => {
    expect(screen.getByText(/Could not load author info/i)).toBeInTheDocument();
  });
});
