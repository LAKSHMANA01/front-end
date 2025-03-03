// Card.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

// Define a dummy icon component that displays its size via a data attribute.
const DummyIcon = ({ size }) => <span data-testid="icon" data-size={size}>Icon</span>;

describe('Card Component', () => {
  const title = 'Test Title';
  const value = '42';
  const onClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and value', () => {
    render(<Card icon={<DummyIcon />} title={title} value={value} onClick={onClick} />);
    
    // Check that the title and value appear in the document.
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  test('calls onClick when the card is clicked', () => {
    const { container } = render(
      <Card icon={<DummyIcon />} title={title} value={value} onClick={onClick} />
    );
    
    // Click the outermost div (the clickable card)
    fireEvent.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('renders the icon with the correct size prop', () => {
    render(<Card icon={<DummyIcon />} title={title} value={value} onClick={onClick} />);
    
    // The DummyIcon should receive the size 32 via React.cloneElement
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-size', '32');
  });

  test('matches the snapshot', () => {
    const { container } = render(
      <Card icon={<DummyIcon />} title={title} value={value} onClick={onClick} />
    );
    expect(container).toMatchSnapshot();
  });
});