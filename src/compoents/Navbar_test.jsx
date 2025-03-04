
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EngineerNavbar from "./Navbar";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
  reducer: {
    engineer: (state = { profiledata: { name: "Test Engineer" } }) => state,
    notifications: (state = { notifications: [{ isRead: false }, { isRead: true }] }) => state,
  },
});

describe("EngineerNavbar Component", () => {
  test("renders correctly with provided props", () => {
    const mockToggleTheme = jest.fn();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <EngineerNavbar onToggleTheme={mockToggleTheme} isDarkMode={false} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Telecom Services/i)).toBeInTheDocument();
   
    expect(screen.getByText("Test Engineer")).toBeInTheDocument();

    
    const logoutLink = screen.getByRole("link", { name: /logout/i });
    expect(logoutLink).toBeInTheDocument();
  });

  test("calls theme toggle when button is clicked", () => {
    const mockToggleTheme = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EngineerNavbar onToggleTheme={mockToggleTheme} isDarkMode={false} />
        </BrowserRouter>
      </Provider>
    );

   
    const toggleButton = screen.getByRole("button", {
      name: "",
    });
  
    fireEvent.click(toggleButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
