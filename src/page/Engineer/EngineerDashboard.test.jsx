import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EngineerLayout from "./EngineerDashboard";


// Mock dependencies
jest.mock("../../page/Engineer/Navbar", () => () => <div data-testid="navbar">Navbar</div>);
jest.mock("./Sidebar", () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

describe("EngineerLayout Component", () => {
  test("renders Navbar, Sidebar, and Outlet correctly", () => {
    render(
      <MemoryRouter>
        <EngineerLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <EngineerLayout />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("has proper layout classes", () => {
    render(
      <MemoryRouter>
        <EngineerLayout />
      </MemoryRouter>
    );

    const mainDiv = screen.getByTestId("outlet").parentElement;
    expect(mainDiv).toHaveClass("flex-1 mt-10 ml-10 md:ml-20 transition-all duration-300 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-6");
  });
});
