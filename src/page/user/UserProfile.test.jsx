import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserProfile from "./UserProfile"; // Adjust path as needed
import { fetchProfile, fetchUpdateProfile } from "../../redux/Slice/UserSlice";

jest.mock("../../redux/Slice/UserSlice", () => ({
  fetchProfile: jest.fn(),
  fetchUpdateProfile: jest.fn(),
}));



describe("UserProfile Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      tickets: {
        profile: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "1234567890",
          address: "123 Main St",
        },
      },
    });
    store.dispatch = jest.fn();
  });

  test("renders user profile with correct information", () => {
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    expect(screen.getByText("Your Profile")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
  });

  test("switches to update tab and updates profile info", async () => {
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    fireEvent.click(screen.getByText("Update Profile"));
    
    const nameInput = screen.getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    fireEvent.click(screen.getByText("Save Changes"));

    expect(fetchUpdateProfile).toHaveBeenCalledWith({
      userEmail: sessionStorage.getItem("email"),
      role: sessionStorage.getItem("role"),
      updatedata: {
        name: "Jane Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        address: "123 Main St",
      },
    });
  });
});
