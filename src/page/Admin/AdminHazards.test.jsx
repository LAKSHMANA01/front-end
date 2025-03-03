// AdminHazards.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminHazards from "./AdminHazards";
import { useDispatch, useSelector } from "react-redux";
import { HazardsTickets, HazardsUpdateTickets, HazardsDeleteTickets } from "../../redux/Slice/EngineerSlice";
import { toast } from "react-toastify";

// Mock react-redux hooks
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock the action creators
jest.mock("../../redux/Slice/EngineerSlice", () => ({
  HazardsTickets: jest.fn(() => ({ type: "HAZARDS_TICKETS" })),
  HazardsUpdateTickets: jest.fn(() => ({ type: "HAZARDS_UPDATE_TICKETS" })),
  HazardsDeleteTickets: jest.fn(() => ({ type: "HAZARDS_DELETE_TICKETS" })),
}));

// Mock react-router-dom components
jest.mock("react-router-dom", () => ({
  Link: ({ children }) => <div>{children}</div>,
  useNavigate: () => jest.fn(),
}));

describe("AdminHazards", () => {
  let mockDispatch;
  const hazards = [
    {
      _id: "1",
      hazardType: "Fire",
      description: "Fire in building",
      riskLevel: "low",
      address: "Addr1",
      pincode: "12345",
    },
    {
      _id: "2",
      hazardType: "Flood",
      description: "Flood warning",
      riskLevel: "high",
      address: "Addr2",
      pincode: "67890",
    },
    {
      _id: "3",
      hazardType: "Earthquake",
      description: "Minor tremors",
      riskLevel: "medium",
      address: "Addr3",
      pincode: "54321",
    },
    {
      _id: "4",
      hazardType: "Unknown",
      description: "Unknown risk",
      riskLevel: "unknown",
      address: "Addr4",
      pincode: "11111",
    },
  ];

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((callback) =>
      callback({
        engineer: { Hazards: hazards, loading: false, error: null },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dispatches HazardsTickets on mount", () => {
    render(<AdminHazards />);
    expect(mockDispatch).toHaveBeenCalledWith(HazardsTickets({}));
  });

  test("renders hazards tasks, header, and search input with proper styling", () => {
    render(<AdminHazards />);
    // Header and Add Hazards button
    expect(screen.getByText(/Hazards Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Hazards/i)).toBeInTheDocument();
    // Search input
    expect(screen.getByPlaceholderText(/Search by hazard type/i)).toBeInTheDocument();
    // All hazard cards are rendered
    expect(screen.getByText(/Harzard : Fire/i)).toBeInTheDocument();
    expect(screen.getByText(/Harzard : Flood/i)).toBeInTheDocument();
    expect(screen.getByText(/Harzard : Earthquake/i)).toBeInTheDocument();
    expect(screen.getByText(/Harzard : Unknown/i)).toBeInTheDocument();
    // Check CSS classes based on riskLevel via getHazardStyles:
    const fireCard = screen.getByText(/Harzard : Fire/i).closest("div");
    expect(fireCard).toHaveClass("bg-yellow-200");
    const floodCard = screen.getByText(/Harzard : Flood/i).closest("div");
    expect(floodCard).toHaveClass("bg-red-200");
    const earthquakeCard = screen.getByText(/Harzard : Earthquake/i).closest("div");
    expect(earthquakeCard).toHaveClass("bg-orange-200");
    const unknownCard = screen.getByText(/Harzard : Unknown/i).closest("div");
    expect(unknownCard).toHaveClass("bg-gray-200");
  });

  test("filters hazards based on search input", () => {
    render(<AdminHazards />);
    const searchInput = screen.getByPlaceholderText(/Search by hazard type/i);
    // Initially, all hazard cards are rendered (4 cards)
    expect(screen.getAllByText(/Harzard :/i)).toHaveLength(4);
    // Change search input to match pincode '12345' (only the Fire hazard)
    fireEvent.change(searchInput, { target: { value: "123" } });
    expect(screen.getByText(/Harzard : Fire/i)).toBeInTheDocument();
    expect(screen.queryByText(/Harzard : Flood/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Harzard : Earthquake/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Harzard : Unknown/i)).not.toBeInTheDocument();
    // Change search input to a value that matches no hazard
    fireEvent.change(searchInput, { target: { value: "zzz" } });
    expect(screen.getByText(/Hazards not found/i)).toBeInTheDocument();
  });

  test("opens and closes detail modal on hazard card click", async () => {
    render(<AdminHazards />);
    // Click on the Fire hazard card to open the detail modal
    const fireCard = screen.getByText(/Harzard : Fire/i).closest("div");
    fireEvent.click(fireCard);
    // Modal shows hazard details
    expect(screen.getByText("Fire")).toBeInTheDocument();
    expect(screen.getByText(/Addr1/i)).toBeInTheDocument();
    // Close modal by clicking the close button ("✕")
    const closeButton = screen.getAllByText("✕")[0];
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText("Fire")).not.toBeInTheDocument();
    });
  });

  test("opens update modal on update button click and pre-populates form", () => {
    render(<AdminHazards />);
    // Open detail modal for the Flood hazard
    const floodCard = screen.getByText(/Harzard : Flood/i).closest("div");
    fireEvent.click(floodCard);
    // Click the update button
    const updateBtn = screen.getByText("Update");
    fireEvent.click(updateBtn);
    // The detail modal should close and the update modal appears
    expect(screen.queryByText("Flood")).not.toBeInTheDocument();
    expect(screen.getByText(/Update Hazard/i)).toBeInTheDocument();
    // Verify that the form fields are pre-populated with Flood hazard data
    expect(screen.getByDisplayValue("Flood")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Flood warning")).toBeInTheDocument();
    expect(screen.getByDisplayValue("67890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Addr2")).toBeInTheDocument();
  });

  test("handles update form input change and submission", () => {
    render(<AdminHazards />);
    // Open detail modal for the Earthquake hazard and then update modal
    const earthquakeCard = screen.getByText(/Harzard : Earthquake/i).closest("div");
    fireEvent.click(earthquakeCard);
    const updateBtn = screen.getByText("Update");
    fireEvent.click(updateBtn);
    // Change the hazardType and description in the update form
    const hazardTypeInput = screen.getByDisplayValue("Earthquake");
    fireEvent.change(hazardTypeInput, { target: { value: "Updated Earthquake" } });
    const descriptionInput = screen.getByDisplayValue("Minor tremors");
    fireEvent.change(descriptionInput, { target: { value: "Updated description" } });
    // Submit the form
    const form = hazardTypeInput.closest("form");
    fireEvent.submit(form);
    // The update modal should close
    expect(screen.queryByText(/Update Hazard/i)).not.toBeInTheDocument();
    // Verify that the update action is dispatched with the updated form data
    expect(mockDispatch).toHaveBeenCalledWith(
      HazardsUpdateTickets({
        _id: "3",
        hazardType: "Updated Earthquake",
        description: "Updated description",
        riskLevel: "medium",
        address: "Addr3",
        pincode: "54321",
      })
    );
  });

  test("handles delete action from detail modal", () => {
    // Spy on toast.success
    const toastSpy = jest.spyOn(toast, "success").mockImplementation(() => {});
    render(<AdminHazards />);
    // Open detail modal for the Unknown hazard
    const unknownCard = screen.getByText(/Harzard : Unknown/i).closest("div");
    fireEvent.click(unknownCard);
    // Click the delete button in the detail modal
    const deleteBtn = screen.getByText("Delete");
    fireEvent.click(deleteBtn);
    // Verify that the delete action is dispatched with the correct _id
    expect(mockDispatch).toHaveBeenCalledWith(HazardsDeleteTickets("4"));
    // Verify that a success toast is shown
    expect(toastSpy).toHaveBeenCalledWith("Hazards deleted successfully!");
    toastSpy.mockRestore();
  });

  test("cancel button in update modal closes the update modal", () => {
    render(<AdminHazards />);
    // Open detail modal for the Flood hazard then open update modal
    const floodCard = screen.getByText(/Harzard : Flood/i).closest("div");
    fireEvent.click(floodCard);
    const updateBtn = screen.getByText("Update");
    fireEvent.click(updateBtn);
    // Click the Cancel button in the update modal
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    // The update modal should close
    expect(screen.queryByText(/Update Hazard/i)).not.toBeInTheDocument();
  });
});