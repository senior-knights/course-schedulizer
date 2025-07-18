import { render } from "@testing-library/react";
import React from "react";
import { App } from "./App";

// Jest doesn't work well with fullcalendar
// see: https://github.com/fullcalendar/fullcalendar/issues/5570
jest.mock("@fullcalendar/react", () => {
  const MockFullCalendar = () => {
    return <div data-testid="mock-fullcalendar" />;
  };
  return MockFullCalendar;
});

jest.mock("@fullcalendar/timegrid", () => {
  return jest.fn();
});

jest.mock("@fullcalendar/interaction", () => {
  return jest.fn();
});

describe("App Component", () => {
  test("renders without crashing", () => {
    const { container } = render(<App />);
    // Verify the app component is created and rendered successfully.
    // This is a smoke test to ensure the component tree renders.
    expect(container.firstChild).toBeInTheDocument();
  });
});
