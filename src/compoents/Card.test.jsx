// src/components/Card.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card";

// Dummy icon component to simulate an icon and verify the "size" prop.
const DummyIcon = ({ size }) => (
  <div data-testid="dummy-icon">Icon size: {size}</div>
);

describe("Card Component", () => {
  test("renders title and value correctly", () => {
    render(
      <Card
        icon={<DummyIcon />}
        title="Test Title"
        value="123"
        onClick={() => {}}
      />
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  test("renders the icon with size set to 32", () => {
    render(
      <Card
        icon={<DummyIcon />}
        title="Title"
        value="Value"
        onClick={() => {}}
      />
    );
    // Verify that the DummyIcon component receives the size prop 32 via cloneElement.
    expect(screen.getByTestId("dummy-icon")).toHaveTextContent("Icon size: 32");
  });

  test("calls onClick handler when card is clicked", () => {
    const handleClick = jest.fn();
    const { container } = render(
      <Card
        icon={<DummyIcon />}
        title="Clickable Card"
        value="456"
        onClick={handleClick}
      />
    );
    // The outermost div is the clickable card.
    fireEvent.click(container.firstChild);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders the outer container with the correct classes", () => {
    const { container } = render(
      <Card
        icon={<DummyIcon />}
        title="Styled Card"
        value="789"
        onClick={() => {}}
      />
    );
    // Verify that the outer container has the expected Tailwind CSS classes.
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass("bg-white");
    expect(outerDiv).toHaveClass("rounded-2xl");
    expect(outerDiv).toHaveClass("p-6");
    expect(outerDiv).toHaveClass("shadow-xl");
    expect(outerDiv).toHaveClass("hover:shadow-2xl");
    expect(outerDiv).toHaveClass("cursor-pointer");
    expect(outerDiv).toHaveClass("border");
    expect(outerDiv).toHaveClass("border-gray-100");
  });
});
