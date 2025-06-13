import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoriesFilter from "../components/CategoriesFilter";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import useWindowWidth from "../utils/useWindowWidth";

const mockStore = configureMockStore([]);

// Mock useWindowWidth hook
jest.mock("../utils/useWindowWidth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const categories = [
  "Home",
  "AskReddit",
  "NoStupidQuestions",
  "BaldursGate3",
  "facepalm",
  "Damnthatsinteresting",
  "LivestreamFail",
  "pics",
  "Palworld",
  "AmItheAsshole",
  "mildlyinfuriating",
  "Piracy",
  "PeterExplainsTheJoke",
  "funny",
  "AITAH",
  "movies",
  "Helldivers",
  "gaming",
  "worldnews",
  "leagueoflegends",
  "pcmasterrace",
  "Unexpected",
  "news",
  "politics",
];

describe("CategoriesFilter", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      posts: { selectedCategory: "Home" },
    });
    store.dispatch = jest.fn();
  });

  test("renders correct number of categories based on window width >= 1024", () => {
    useWindowWidth.mockReturnValue(1200); // Large screen

    render(
      <Provider store={store}>
        <CategoriesFilter />
      </Provider>
    );

    // Default visible count for width >= 1024 is 10 + 1 for Show More button
    const buttons = screen.getAllByRole("button");
    // 10 categories + 1 Show More button = 11 buttons total
    expect(buttons).toHaveLength(11);

    expect(screen.getByText("Show More")).toBeInTheDocument();
  });

  test("renders correct number of categories based on window width < 1024", () => {
    useWindowWidth.mockReturnValue(500); // Small screen

    render(
      <Provider store={store}>
        <CategoriesFilter />
      </Provider>
    );

    // Default visible count for width < 1024 is 5 + 1 for Show More button
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(6);
    expect(screen.getByText("Show More")).toBeInTheDocument();
  });

  test("clicking category dispatches actions", async () => {
    useWindowWidth.mockReturnValue(1200);

    render(
      <Provider store={store}>
        <CategoriesFilter />
      </Provider>
    );

    const askRedditBtn = screen.getByRole("button", { name: "AskReddit" });
    await userEvent.click(askRedditBtn);

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "posts/setSelectedCategory",
      payload: "AskReddit",
    });
    // fetchPosts thunk is dispatched, can't easily test exact action object here
  });

  test("Show More button toggles category list", async () => {
    useWindowWidth.mockReturnValue(500); // Small screen, initially 5 categories shown

    render(
      <Provider store={store}>
        <CategoriesFilter />
      </Provider>
    );

    const showMoreBtn = screen.getByRole("button", { name: "Show More" });
    expect(showMoreBtn).toBeInTheDocument();

    // Initially 5 categories + 1 show more button
    expect(screen.getAllByRole("button")).toHaveLength(6);

    // Click Show More, all categories visible + Show Less button
    await userEvent.click(showMoreBtn);

    // categories.length + 1
    expect(screen.getAllByRole("button")).toHaveLength(categories.length + 1);

    expect(
      screen.getByRole("button", { name: "Show Less" })
    ).toBeInTheDocument();

    // Click Show Less toggles back
    await userEvent.click(screen.getByRole("button", { name: "Show Less" }));
    expect(
      screen.getByRole("button", { name: "Show More" })
    ).toBeInTheDocument();
  });
});
