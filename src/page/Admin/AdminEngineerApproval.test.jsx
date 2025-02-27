import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminEngineerApproval from "./AdminEngineerApproval";
import { approveEngineer, fetchAllEngineers, fetchAllApprovedEngineers } from "../../redux/Slice/AdminSlice";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("AdminEngineerApproval Component", () => {
  let mockDispatch;

  const createMockStore = (initialState) => {
    return createStore(() => initialState);
  };

  const renderWithProviders = (component, store) => {
    return render(
      <MemoryRouter>
        <Provider store={store}>{component}</Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls disapprove function when disapprove button is clicked", async () => {
    useSelector.mockReturnValue({
      engineers: [{ _id: "1", name: "John Doe", email: "john@example.com", isEngineer: true }],
      loading: false,
      error: null,
    });

    renderWithProviders(<AdminEngineerApproval />, createMockStore({ admin: {} }));

    const disapproveButton = screen.getByText("Disapprove");
    fireEvent.click(disapproveButton);

    // Ensure approveEngineer was dispatched with 'false'
    await waitFor(() => {
      expect(mockDispatch.mock.calls.some(call =>
        JSON.stringify(call[0]) === JSON.stringify(approveEngineer({ engineerEmail: "john@example.com", approve: false }))
      )).toBe(true);
    });

    // Ensure fetch actions were dispatched after disapproval
    await waitFor(() => {
      expect(mockDispatch.mock.calls.some(call =>
        JSON.stringify(call[0]) === JSON.stringify(fetchAllApprovedEngineers())
      )).toBe(true);

      expect(mockDispatch.mock.calls.some(call =>
        JSON.stringify(call[0]) === JSON.stringify(fetchAllEngineers())
      )).toBe(true);
    });
  });
});
