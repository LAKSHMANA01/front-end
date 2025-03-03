import reducer, { submitTicket, HazardsTicket } from "./raiseticke";
import apiClientUser from "../../utils/apiClientUser";
import apiClientNH from "../../utils/apiClientNH";

jest.mock("../../utils/apiClientUser", () => ({
  post: jest.fn(),
}));

jest.mock("../../utils/apiClientNH", () => ({
  post: jest.fn(),
}));

// ---------------------------------------------------------------------
// Reducer tests
// ---------------------------------------------------------------------
describe("ticketSlice reducer", () => {
  const initialState = {
    isLoading: false,
    data: [],
    HazardsRisetickes: [],
    isError: false,
    errorMessage: "",
  };

  // --- submitTicket reducer tests ---
  describe("submitTicket reducer cases", () => {
    it("should set isLoading true on submitTicket.pending", () => {
      const action = { type: submitTicket.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it("should push payload into data on submitTicket.fulfilled", () => {
      const payload = { id: 1, subject: "Ticket Data" };
      const action = { type: submitTicket.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.data).toContainEqual(payload);
    });

    it("should set isError true and errorMessage on submitTicket.rejected", () => {
      const errorMessage = "Submission failed";
      const action = { type: submitTicket.rejected.type, payload: errorMessage };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.errorMessage).toEqual(errorMessage);
    });
  });

  // --- HazardsTicket reducer tests ---
  describe("HazardsTicket reducer cases", () => {
    it("should set isLoading true on HazardsTicket.pending", () => {
      const action = { type: HazardsTicket.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it("should push payload into HazardsRisetickes on HazardsTicket.fulfilled", () => {
      const payload = { id: 2, hazard: "Hazard Data" };
      const action = { type: HazardsTicket.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.HazardsRisetickes).toContainEqual(payload);
    });

    it("should set isError true and errorMessage on HazardsTicket.rejected", () => {
      const errorMessage = "Hazard submission failed";
      const action = { type: HazardsTicket.rejected.type, payload: errorMessage };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.errorMessage).toEqual(errorMessage);
    });
  });
});

// ---------------------------------------------------------------------
// Async thunk tests
// ---------------------------------------------------------------------
describe("ticketSlice async thunks", () => {
  const dummyDispatch = jest.fn();
  const dummyGetState = jest.fn();
  const dummyExtra = undefined;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- submitTicket async thunk tests ---
  describe("submitTicket thunk", () => {
    it("should submit ticket successfully", async () => {
      const ticketData = { email: "test@example.com", subject: "Test Ticket" };
      const responseData = { id: 1, subject: "Test Ticket" };
      // Mock apiClientUser.post to resolve with response.data
      apiClientUser.post.mockResolvedValue({ data: responseData });
      
      const action = submitTicket(ticketData);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(responseData);
      expect(apiClientUser.post).toHaveBeenCalledWith(
        `/users/raiseTicket/${ticketData.email}`,
        { subject: "Test Ticket" }
      );
    });

    it("should handle error in submitTicket", async () => {
      const ticketData = { email: "error@example.com", subject: "Error Ticket" };
      const errorObj = new Error("Network error");
      // Simulate error thrown from apiClientUser.post
      apiClientUser.post.mockRejectedValue(errorObj);
      
      const action = submitTicket(ticketData);
      // Note: since the thunk catches the error and returns it, unwrap() resolves with the error.
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(errorObj);
      expect(apiClientUser.post).toHaveBeenCalledWith(
        `/users/raiseTicket/${ticketData.email}`,
        { subject: "Error Ticket" }
      );
    });
  });

  // --- HazardsTicket async thunk tests ---
  describe("HazardsTicket thunk", () => {
    it("should submit hazard ticket successfully", async () => {
      const ticketData = { hazard: "New Hazard", details: "Details" };
      const responseData = { id: 2, hazard: "New Hazard" };
      apiClientNH.post.mockResolvedValue({ data: responseData });

      const action = HazardsTicket(ticketData);
      const result = await action(dummyDispatch, dummyGetState, dummyExtra).unwrap();
      expect(result).toEqual(responseData);
      expect(apiClientNH.post).toHaveBeenCalledWith(
        "/hazards/addNewHazard",
        ticketData,
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should handle error in HazardsTicket", async () => {
      const ticketData = { hazard: "Error Hazard", details: "Error Details" };
      const errorResponse = { response: { data: "Failed to add hazard" } };
      apiClientNH.post.mockRejectedValue(errorResponse);

      const action = HazardsTicket(ticketData);
      await expect(action(dummyDispatch, dummyGetState, dummyExtra).unwrap())
        .rejects.toEqual("Failed to add hazard");
      expect(apiClientNH.post).toHaveBeenCalledWith(
        "/hazards/addNewHazard",
        ticketData,
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });
});