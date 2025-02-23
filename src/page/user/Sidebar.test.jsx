// src/page/user/Sidebar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
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
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(localStorage.getItem('isSidebarExpanded')).toBe('false');
    fireEvent.click(toggleButton);
    expect(localStorage.getItem('isSidebarExpanded')).toBe('true');
  });

  test('navigates to the correct path', () => {
    render(
      <BrowserRouter>
        <Sidebar activePath="/User" />
      </BrowserRouter>
    );
    const dashboardItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardItem);
    expect(dashboardItem).toHaveClass('active');
  });
});