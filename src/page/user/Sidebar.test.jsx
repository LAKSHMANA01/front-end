import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    sessionStorage.setItem("email", "test@example.com");
    localStorage.setItem("isSidebarExpanded", JSON.stringify(true));
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("renders sidebar correctly", () => {
    render(
      <BrowserRouter>
        <Sidebar activePath="/User" isopen={true} onSidebarClose={jest.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("MyTicket")).toBeInTheDocument();
    expect(screen.getByText("RaiseTickets")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("handles sidebar toggle", () => {
    render(
      <BrowserRouter>
        <Sidebar activePath="/User" isopen={true} onSidebarClose={jest.fn()} />
      </BrowserRouter>
    );

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    
    expect(JSON.parse(localStorage.getItem("isSidebarExpanded"))).toBe(false);
  });

  it("navigates correctly on menu click", () => {
    const mockNavigate = require("react-router-dom").useNavigate;
    mockNavigate.mockImplementation(jest.fn());

    render(
      <BrowserRouter>
        <Sidebar activePath="/User" isopen={true} onSidebarClose={jest.fn()} />
      </BrowserRouter>
    );

    const dashboardButton = screen.getByText("Dashboard");
    fireEvent.click(dashboardButton);

    expect(mockNavigate).toHaveBeenCalledWith("/User");
  });

  it("closes sidebar on mobile navigation", () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));
    const mockOnSidebarClose = jest.fn();

    render(
      <BrowserRouter>
        <Sidebar activePath="/User" isopen={true} onSidebarClose={mockOnSidebarClose} />
      </BrowserRouter>
    );

    const dashboardButton = screen.getByText("Dashboard");
    fireEvent.click(dashboardButton);
    
    expect(mockOnSidebarClose).toHaveBeenCalled();
  });
});
