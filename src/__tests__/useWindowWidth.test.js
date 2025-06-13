import { render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import React from "react";
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

// Test component
function TestComponent() {
  const width = useWindowWidth();
  return <div data-testid="width">{width}</div>;
}

test("useWindowWidth returns current window width", () => {
  const { getByTestId } = render(<TestComponent />);
  expect(getByTestId("width").textContent).toBe(window.innerWidth.toString());
});
