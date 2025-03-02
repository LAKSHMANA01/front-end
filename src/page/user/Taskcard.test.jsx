import React from "react";
import { render, screen } from "@testing-library/react";
import TaskCard from './Taskcard';

jest.mock("../../compoents/footers", () => () => <div>Mock Footer</div>);

describe("TaskCard Component", () => {
  const task = {
    serviceType: "Repair",
    status: "in-progress",
    description: "Fixing the AC unit",
    priority: "high",
    engineerEmail: "engineer@example.com",
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2023-10-05T00:00:00Z",
  };

  

  it("renders priority indicator when showPriority is true", () => {
    render(<TaskCard task={task} showPriority={true} assignEngineer={false} />);
    expect(screen.getByText(/high priority/i)).toBeInTheDocument();
  });

  it("does not render priority when showPriority is false", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={false} />);
    expect(screen.queryByText(/high priority/i)).not.toBeInTheDocument();
  });

  it("renders assigned engineer details when assignEngineer is true", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={true} />);
    expect(screen.getByText(/Assigned Engineer/i)).toBeInTheDocument();
  });

  it("does not render assigned engineer details when assignEngineer is false", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={false} />);
    expect(screen.queryByText(/Assigned Engineer/i)).not.toBeInTheDocument();
  });

  it("renders created and updated dates correctly", () => {
    render(<TaskCard task={task} showPriority={false} assignEngineer={false} />);
    expect(screen.getByText(/Created At/i)).toHaveTextContent("Created At: 10/1/2023");
    expect(screen.getByText(/Updated At/i)).toHaveTextContent("Updated At: 10/5/2023");
  });
});
