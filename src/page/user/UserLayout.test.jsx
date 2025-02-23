import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from './UserLayout';

jest.mock('./Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('./Sidebar', () => ({ isExpanded, setIsExpanded }) => (
  <div
    data-testid="sidebar"
    data-expanded={isExpanded}
    onClick={() => setIsExpanded(!isExpanded)}
  >
    Sidebar
  </div>
));

const MockChild = () => <div data-testid="outlet">Child Component</div>;

describe('UserLayout Component', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={component}>
            <Route index element={<MockChild />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  test('renders all main components', () => {
    renderWithRouter(<UserLayout />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument(); // Now this should work
  });
});
