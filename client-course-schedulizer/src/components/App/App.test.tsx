import { render } from "@testing-library/react";
import React from "react";
import { App } from "./App";

// Jest doesn't work well with fullcalendar
// see: https://github.com/fullcalendar/fullcalendar/issues/5570
jest.mock("@fullcalendar/react", () => {
  const aDiv = () => {
    return <div />;
  };
  return aDiv;
});
jest.mock("@fullcalendar/timegrid", () => {
  return jest.fn();
});
jest.mock("@fullcalendar/interaction", () => {
  return jest.fn();
});

test("renders without crashing", () => {
  render(<App />);
});
