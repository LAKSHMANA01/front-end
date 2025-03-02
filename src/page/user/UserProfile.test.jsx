import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import ticketReducer, { fetchUpdateProfile, fetchProfile } from "../../redux/Slice/UserSlice";
import UserProfile from "./UserProfile";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import mockAxios from "jest-mock-axios";

// Mock Redux store
const mockStore = (preloadedState) =>
  configureStore({
    reducer: {
      tickets: ticketReducer,
    },
    preloadedState,
  });

describe("UserProfile Component", () => {
  let store;
  let preloadedState;

  beforeEach(() => {
    preloadedState = {
      tickets: {
        profile: {
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          address: "123 Main St",
        },
        loading: false,
        error: null,
        success: false,
      },
    };

    store = mockStore(preloadedState);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

  test("renders user profile information", () => {
    renderComponent();

    expect(screen.getByText(/Your Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("switches tabs correctly", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Update Profile/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });
  });

  test("validates email format", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Update Profile/i));

    const emailInput = screen.getByLabelText(/Email/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.click(screen.getByText(/Save Changes/i));

    expect(await screen.findByText(/Invalid email format/i)).toBeInTheDocument();
  });

  test("validates phone number format", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Update Profile/i));

    const phoneInput = screen.getByLabelText(/Phone/i);
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, "12345");
    fireEvent.click(screen.getByText(/Save Changes/i));

    expect(await screen.findByText(/Invalid phone number/i)).toBeInTheDocument();
  });

  test("submits profile updates successfully", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Update Profile/i));

    const nameInput = screen.getByLabelText(/Full Name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");
    fireEvent.click(screen.getByText(/Save Changes/i));

    await act(async () => {
      await store.dispatch(
        fetchUpdateProfile({
          userEmail: "john@example.com",
          role: "user",
          updatedata: { name: "Jane Doe" },
        })
      );
    });

    await waitFor(() => {
      expect(store.getState().tickets.profile.name).toBe("Jane Doe");
    });

    expect(screen.getByText(/Profile Updated!/i)).toBeInTheDocument();
  });

  test("renders fallback when profile data is missing", () => {
    store = mockStore({
      tickets: { profile: {}, loading: false, error: null },
    });

    render(
      <Provider store={store}>
        <UserProfile />
      </Provider>
    );

    expect(screen.getByText(/No profile data available/i)).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    store = mockStore({
      tickets: {
        profile: {},
        loading: false,
        error: "Failed to fetch profile",
      },
    });

    renderComponent();

    expect(screen.getByText(/Failed to fetch profile/i)).toBeInTheDocument();
  });
});
