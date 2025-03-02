import React from "react"; 
import { render, screen } from "@testing-library/react";
import TaskCard from "./Taskcard";
import "@testing-library/jest-dom";

describe("TaskCard Component", () => {
  const task = {
    serviceType: "Installation",
    status: "in-progress",
    description: "Set up network cables.",
    priority: "high",
    engineerEmail: "engineer@example.com",
    createdAt: "2024-02-29T10:00:00Z",
    updatedAt: "2024-02-29T12:00:00Z",
  };

  test("renders task details correctly", () => {
    render(<TaskCard task={task} showPriority={true} assignEngineer={true} />);

    expect(screen.getByText(/Service Type : Installation/i)).toBeInTheDocument();
    expect(screen.getByText(/Status :/i)).toBeInTheDocument();
    expect(screen.getByText(/in-progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Description : Set up network cables./i)).toBeInTheDocument();
  });

  test("renders priority indicator when showPriority is true", () => {
    render(<TaskCard task={task} showPriority={true} assignEngineer={false} />);
    expect(screen.getByText(/high priority/i)).toBeInTheDocument();
  });

  test("does not render priority indicator when showPriority is false", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={false} />);
    expect(screen.queryByText(/high priority/i)).not.toBeInTheDocument();
  });

  test("renders assigned engineer when assignEngineer is true", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={true} />);
    expect(screen.getByText(/Assigned Engineer : engineer@example.com/i)).toBeInTheDocument();
  });

  test("does not render assigned engineer when assignEngineer is false", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={false} />);
    expect(screen.queryByText(/Assigned Engineer : engineer@example.com/i)).not.toBeInTheDocument();
  });

  test("renders createdAt and updatedAt dates correctly", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={false} />);
    expect(screen.getByText(/Created At: 2\/29\/2024/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated At: 2\/29\/2024/i)).toBeInTheDocument();
  });

  test("applies correct status styles", () => {
    const { container } = render(<TaskCard task={{ ...task, status: "completed" }} />);
    expect(container.querySelector(".text-green-600")).toBeInTheDocument();

    render(<TaskCard task={{ ...task, status: "pending" }} />);
    expect(screen.getByText("pending")).toHaveClass("text-yellow-600");

    render(<TaskCard task={{ ...task, status: "unknown" }} />);
    expect(screen.getByText("unknown")).toHaveClass("text-gray-600");
  });

  test("applies correct priority colors", () => {
    const { container } = render(<TaskCard task={{ ...task, priority: "high" }} showPriority />);
    expect(container.querySelector(".bg-red-500")).toBeInTheDocument();

    render(<TaskCard task={{ ...task, priority: "medium" }} showPriority />);
    expect(screen.getByText(/medium priority/i)).toHaveClass("text-gray-500");

    render(<TaskCard task={{ ...task, priority: "low" }} showPriority />);
    expect(screen.getByText(/low priority/i)).toHaveClass("text-gray-500");
  });

  // Additional tests for 100% coverage
  test("renders default values when task is undefined", () => {
    render(<TaskCard task={{}} showPriority={true} assignEngineer={true} />);
    expect(screen.getByText(/Service Type :/i)).toBeInTheDocument();
    expect(screen.getByText(/Status :/i)).toBeInTheDocument();
  });

  test("renders without engineer assigned", () => {
    const taskWithoutEngineer = { ...task, engineerEmail: null };
    render(<TaskCard task={taskWithoutEngineer} showPriority={true} assignEngineer={true} />);
    expect(screen.getByText(/Assigned Engineer :/i).textContent).toBe("Assigned Engineer : ");
  });

  test("renders default values for missing createdAt and updatedAt", () => {
    const taskWithoutDates = { ...task, createdAt: null, updatedAt: null };
    render(<TaskCard task={taskWithoutDates} showPriority={true} assignEngineer={true} />);
    expect(screen.queryByText(/Created At:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Updated At:/i)).not.toBeInTheDocument();
  });

  test("handles unknown priority values", () => {
    render(<TaskCard task={{ ...task, priority: "very-high" }} showPriority={true} />);
    expect(screen.getByText(/very-high priority/i)).toHaveClass("text-gray-500");
  });

  test("handles unknown status values", () => {
    render(<TaskCard task={{ ...task, status: "delayed" }} />);
    expect(screen.getByText("delayed")).toHaveClass("text-gray-600");
  });
});
