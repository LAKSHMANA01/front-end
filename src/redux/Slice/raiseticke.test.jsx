import reducer, { submitTicket, HazardsTicket } from './raiseticke';

describe('ticketSlice reducer', () => {
  const initialState = {
    isLoading: false,
    data: [],
    HazardsRisetickes: [],
    isError: false,
    errorMessage: "",
 
  };

  describe('submitTicket', () => {
    it('should set isLoading true when pending', () => {
      const action = { type: submitTicket.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should add the submitted ticket to data and set isLoading to false when fulfilled', () => {
      const ticket = { id: 1, description: 'Test Ticket' };
      const action = { type: submitTicket.fulfilled.type, payload: ticket };
      const state = reducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual([ticket]);
    });

    it('should set isError true, update errorMessage, and set isLoading to false when rejected', () => {
      const errorMsg = "Failed to submit ticket";
      const action = { type: submitTicket.rejected.type, payload: errorMsg };
      const state = reducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.errorMessage).toBe(errorMsg);
    });
  });

  describe('HazardsTicket', () => {
    it('should set isLoading true when pending', () => {
      const action = { type: HazardsTicket.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should add the hazard ticket to HazardsRisetickes and set isLoading to false when fulfilled', () => {
      const hazardTicket = { id: 2, hazard: 'Test Hazard' };
      const action = { type: HazardsTicket.fulfilled.type, payload: hazardTicket };
      const state = reducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.HazardsRisetickes).toEqual([hazardTicket]);
    });

    it('should set isError true, update errorMessage, and set isLoading to false when rejected', () => {
      const errorMsg = "Failed to submit hazard ticket";
      const action = { type: HazardsTicket.rejected.type, payload: errorMsg };
      const state = reducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.errorMessage).toBe(errorMsg);
    });
  });
});