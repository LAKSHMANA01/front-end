import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import engineerReducer, {
  fetchProfile,
  fetchUpdateEngineerProfile,
  fetchEngineerTasks,
} from "../../redux/Slice/EngineerSlice";
import EngineerProfile from "./EngineerProfile";
import { useSelector, useDispatch } from "react-redux";

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn((key) => {
    if (key === "email") return "test@example.com";
    if (key === "role") return "engineer";
    return null;
  }),
};

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
  writable: true,
});

// Mock Redux Actions
jest.mock("../../redux/Slice/EngineerSlice", () => ({
  ...jest.requireActual("../../redux/Slice/EngineerSlice"),
  fetchProfile: jest.fn(),
  fetchUpdateEngineerProfile: jest.fn(),
  fetchEngineerTasks: jest.fn(),
}));

// Mock useDispatch hook
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

// Mock Navbar component
jest.mock("./Navbar", () => () => <div data-testid="navbar-mock">Navbar</div>);

describe("EngineerProfile Component", () => {
  let mockState;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Initialize mock state
    mockState = {
      engineer: {
        profile: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "1234567890",
          address: "123 Main Street",
          availability: {
            Monday: true,
            Tuesday: false,
            Wednesday: true,
            Thursday: false,
            Friday: true,
            Saturday: false,
            Sunday: true,
          },
          specialization: "Installation",
        },
        updateSuccess: false,
        loading: false,
      },
      notifications: {
        notifications: [],
      },
    };

    // Mock useSelector to return our mock state
    useSelector.mockImplementation((selector) => {
      // Handle the specific case for profile data
      if (selector === expect.any(Function)) {
        return mockState.engineer;
      }
      return selector(mockState);
    });

    // Mock implementations for Redux actions
    fetchProfile.mockReturnValue({ type: "engineer/fetchProfile" });
    fetchUpdateEngineerProfile.mockReturnValue({ 
      type: "engineer/fetchUpdateEngineerProfile"
    });
    fetchEngineerTasks.mockReturnValue({ type: "engineer/fetchEngineerTasks" });
  });

  test("renders EngineerProfile component correctly", () => {
    render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );

    expect(screen.getByText("Engineer Profile")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();
  });

  test("dispatches fetchProfile and fetchEngineerTasks action on mount", async () => {
    render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchProfile({ 
        userEmail: "test@example.com", 
        role: "engineer"
      }));
    });
    
    // Verify fetchEngineerTasks was also called
    expect(mockDispatch).toHaveBeenCalledWith(fetchEngineerTasks());
  });

  test("initializes engineer state with profile data", async () => {
    // Set up the initial profile data as undefined to trigger the useEffect
    useSelector.mockImplementationOnce(() => ({
      profile: undefined // Initially no profile
    }));
    
    render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );

    // Verify fetchProfile was called
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchProfile({
        userEmail: "test@example.com",
        role: "engineer"
      }));
    });
    
    // Now change the mock to simulate profile data being loaded
    useSelector.mockImplementation(() => ({
      profile: mockState.engineer.profile
    }));
    
    // Re-render to trigger the second useEffect
    render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );
    
    // Since the component has loaded with profile data, we should see the name
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("allows profile update", async () => {
    render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );

    // Click on the Update Profile tab
    fireEvent.click(screen.getByText("Update Profile"));
    
    // Find input field by its value (more reliable than by label)
    const inputs = screen.getAllByRole("textbox");
    const nameInput = inputs.find(input => input.value === "John Doe");
    
    // Change the input value
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    
    // Find and click the Save Changes button
    fireEvent.click(screen.getByText("Save Changes"));
    
    // Check that the correct action was dispatched
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "engineer/fetchUpdateEngineerProfile"
        })
      );
    });
  });

  test("toggles availability checkboxes", async () => {
    render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );

    // Click on the Update Profile tab
    fireEvent.click(screen.getByText("Update Profile"));
    
    // Find all checkboxes
    const checkboxes = screen.getAllByRole("checkbox");
    const mondayCheckbox = checkboxes[0]; // First day is Monday
    
    // Get initial state
    const initialCheckedState = mondayCheckbox.checked;
    
    // Toggle the checkbox
    fireEvent.click(mondayCheckbox);
    
    // Verify the checkbox state changed
    expect(mondayCheckbox.checked).not.toBe(initialCheckedState);
  });

  test("changes specialization when radio button is clicked", async () => {
    render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );

    // Click on the Update Profile tab
    fireEvent.click(screen.getByText("Update Profile"));
    
    // Find the radio buttons
    const radioButtons = screen.getAllByRole("radio");
    const faultRadio = radioButtons.find(radio => radio.value === "Fault");
    
    // Click the Fault radio button
    fireEvent.click(faultRadio);
    
    // Verify it's checked
    expect(faultRadio.checked).toBe(true);
  });

  test("shows success message on profile update", async () => {
    // Setup the success state change after dispatching
    mockDispatch.mockImplementationOnce(action => {
      if (action.type === "engineer/fetchUpdateEngineerProfile") {
        // Simulate the promise resolving
        return Promise.resolve();
      }
      return action;
    });

    const { rerender } = render(
      <Provider store={configureStore({
        reducer: {
          engineer: engineerReducer,
          notifications: (state = { notifications: [] }) => state,
        }
      })}>
        <EngineerProfile />
      </Provider>
    );

    // Click on the Update Profile tab
    fireEvent.click(screen.getByText("Update Profile"));
    
    // Find and click the Save Changes button
    fireEvent.click(screen.getByText("Save Changes"));
    
    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText("Profile Updated!")).toBeInTheDocument();
    });
  });
});