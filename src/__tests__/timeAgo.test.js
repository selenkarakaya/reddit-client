import { timeAgo } from "../utils/timeAgo";

describe("timeAgo function", () => {
  const now = Date.now();

  beforeAll(() => {
    jest.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("returns 'Just now' for timestamps less than a minute ago", () => {
    const lessThanAMinuteAgo = Math.floor((now - 30 * 1000) / 1000);
    expect(timeAgo(lessThanAMinuteAgo)).toBe("Just now");
  });

  test("returns minutes ago for timestamps within the hour", () => {
    const fiveMinutesAgo = Math.floor((now - 5 * 60 * 1000) / 1000);
    expect(timeAgo(fiveMinutesAgo)).toBe("5 minutes ago");
  });

  test("returns singular minute ago for exactly one minute", () => {
    const oneMinuteAgo = Math.floor((now - 60 * 1000) / 1000);
    expect(timeAgo(oneMinuteAgo)).toBe("1 minute ago");
  });

  test("returns hours ago for timestamps within the day", () => {
    const threeHoursAgo = Math.floor((now - 3 * 60 * 60 * 1000) / 1000);
    expect(timeAgo(threeHoursAgo)).toBe("3 hours ago");
  });

  test("returns singular hour ago for exactly one hour", () => {
    const oneHourAgo = Math.floor((now - 60 * 60 * 1000) / 1000);
    expect(timeAgo(oneHourAgo)).toBe("1 hour ago");
  });

  test("returns days ago for timestamps within the week", () => {
    const twoDaysAgo = Math.floor((now - 2 * 24 * 60 * 60 * 1000) / 1000);
    expect(timeAgo(twoDaysAgo)).toBe("2 days ago");
  });

  test("returns singular day ago for exactly one day", () => {
    const oneDayAgo = Math.floor((now - 24 * 60 * 60 * 1000) / 1000);
    expect(timeAgo(oneDayAgo)).toBe("1 day ago");
  });

  test("returns locale date string for timestamps older than a week", () => {
    const eightDaysAgo = Math.floor((now - 8 * 24 * 60 * 60 * 1000) / 1000);
    const expectedDate = new Date(eightDaysAgo * 1000).toLocaleDateString();
    expect(timeAgo(eightDaysAgo)).toBe(expectedDate);
  });
});
