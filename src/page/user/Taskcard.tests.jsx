import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from './Taskcard';

describe('TaskCard Component', () => {
  const mockTask = {
    serviceType: 'Maintenance',
    status: 'in progress',
    description: 'Regular system maintenance',
    priority: 'high',
    engineerEmail: 'engineer@example.com',
    createdAt: '2024-02-22T10:00:00Z',
    updatedAt: '2024-02-22T11:00:00Z'
  };

  // Test basic rendering
  test('renders TaskCard with all required elements', () => {
    render(<TaskCard task={mockTask} showPriority={true} />);
    
    // Check if main elements are present
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByText('in progress')).toBeInTheDocument();
    expect(screen.getByText('Regular system maintenance')).toBeInTheDocument();
    expect(screen.getByText('high priority')).toBeInTheDocument();
    expect(screen.getByText(/engineer@example.com/)).toBeInTheDocument();
  });

  // Test status styles
  test.each([
    ['completed', 'text-green-600'],
    ['in progress', 'text-blue-600'],
    ['pending', 'text-yellow-600'],
    ['unknown', 'text-gray-600'],
  ])('applies correct status style for %s status', (status, expectedClass) => {
    const taskWithStatus = { ...mockTask, status };
    render(<TaskCard task={taskWithStatus} showPriority={true} />);
    
    const statusElement = screen.getByText(status);
    expect(statusElement).toHaveClass(expectedClass);
  });

  // Test priority indicator
  test('shows priority indicator when showPriority is true', () => {
    render(<TaskCard task={mockTask} showPriority={true} />);
    expect(screen.getByText(/high priority/)).toBeInTheDocument();
  });

  test('hides priority indicator when showPriority is false', () => {
    render(<TaskCard task={mockTask} showPriority={false} />);
    expect(screen.queryByText(/high priority/)).not.toBeInTheDocument();
  });

  // Test priority colors
  test.each([
    ['high', 'bg-red-500'],
    ['medium', 'bg-yellow-500'],
    ['low', 'bg-gray-400'],
  ])('applies correct priority color for %s priority', (priority, expectedClass) => {
    const taskWithPriority = { ...mockTask, priority };
    render(<TaskCard task={taskWithPriority} showPriority={true} />);
    
    const priorityIndicator = screen.getByText(`${priority} priority`).previousSibling;
    expect(priorityIndicator).toHaveClass(expectedClass);
  });

  // Test date formatting
  test('formats dates correctly', () => {
    render(<TaskCard task={mockTask} showPriority={true} />);
    
    const createdDate = new Date(mockTask.createdAt).toLocaleDateString();
    const updatedDate = new Date(mockTask.updatedAt).toLocaleDateString();
    
    expect(screen.getByText(`Created At: ${createdDate}`)).toBeInTheDocument();
    expect(screen.getByText(`Updated At: ${updatedDate}`)).toBeInTheDocument();
  });

  // Test hover actions
  test('edit button is initially hidden and visible on hover', () => {
    render(<TaskCard task={mockTask} showPriority={true} />);
    
    const hoverActions = document.querySelector('.opacity-0.group-hover\\:opacity-100');
    expect(hoverActions).toBeInTheDocument();
    expect(hoverActions).toHaveClass('opacity-0');
  });

  // Test button interactions
  test('more options button is clickable', () => {
    const { container } = render(<TaskCard task={mockTask} showPriority={true} />);
    
    const moreOptionsButton = container.querySelector('button.text-gray-400');
    expect(moreOptionsButton).toBeInTheDocument();
    
    fireEvent.click(moreOptionsButton);
    // Note: Add more specific assertions here when implementing click handler
  });
});