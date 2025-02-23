// src/components/PageNotFound.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageNotFound from './PageNotFound';

describe('PageNotFound', () => {
  test('renders PageNotFound component', () => {
    render(<PageNotFound />);
    const notFoundElement = screen.getByText('Oops! Page Not Found');
    expect(notFoundElement).toBeInTheDocument();
  });

  test('renders 404 header', () => {
    render(<PageNotFound />);
    const headerElement = screen.getByText('404');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders astronaut illustration', () => {
    render(<PageNotFound />);
    const imgElement = screen.getByAltText('Lost in Space');
    expect(imgElement).toBeInTheDocument();
  });

  test('animates astronaut illustration on refresh', () => {
    render(<PageNotFound />);
    const imgElement = screen.getByAltText('Lost in Space');
    fireEvent.click(imgElement);
    expect(imgElement).toHaveClass('animate-bounce');
  });

  test('handles countdown correctly', () => {
    jest.useFakeTimers();
    render(<PageNotFound />);
    expect(screen.getByText('10')).toBeInTheDocument();
    jest.advanceTimersByTime(1000);
    expect(screen.getByText('9')).toBeInTheDocument();
    jest.advanceTimersByTime(9000);
    expect(screen.queryByText('0')).toBeInTheDocument();
    jest.useRealTimers();
  });
});