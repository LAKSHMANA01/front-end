// AdminDashboard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from './AdminDashboard';

// Mock the child components
jest.mock('./Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('./Dashbord', () => () => <div data-testid="dashbord">Dashbord</div>);

describe('AdminDashboard Component', () => {
  test('renders Sidebar, Navbar, and Dashbord components', () => {
    render(<AdminDashboard />);
    
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toHaveTextContent('Navbar');
    
    expect(screen.getByTestId('dashbord')).toBeInTheDocument();
    expect(screen.getByTestId('dashbord')).toHaveTextContent('Dashbord');
  });

  test('matches the snapshot', () => {
    const { container } = render(<AdminDashboard />);
    expect(container).toMatchSnapshot();
  });
});