import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Sidebar', () => {
  test('renders Sidebar component', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    const sidebarElement = screen.getByRole('navigation');
    expect(sidebarElement).toBeInTheDocument();
  });

  test('toggles sidebar expansion', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const toggleButton = screen.getByRole('button'); // Finding first button

    // Click to collapse sidebar
    fireEvent.click(toggleButton);
    expect(localStorage.getItem('isSidebarExpanded')).toBe('false');

    // Click again to expand sidebar
    fireEvent.click(toggleButton);
    expect(localStorage.getItem('isSidebarExpanded')).toBe('true');
  });

  test('navigates to the correct path', () => {
    render(
      <BrowserRouter>
        <Sidebar activePath="/User" />
      </BrowserRouter>
    );

    const dashboardItems = screen.getAllByText('Dashboard'); // Get all Dashboard elements
    fireEvent.click(dashboardItems[0]); // Click first "Dashboard" button

    // Expect navigation to be called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/User');
  });
});
