
// src/page/user/Navbar.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Navbar from './Navbar';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Bell: () => <div data-testid="bell-icon">Bell Icon</div>,
  Search: () => <div data-testid="search-icon">Search Icon</div>,
  Sun: () => <div data-testid="sun-icon">Sun Icon</div>,
  Moon: () => <div data-testid="moon-icon">Moon Icon</div>,
  Menu: () => <div data-testid="menu-icon">Menu Icon</div>,
  LogOut: () => <div data-testid="logout-icon">Logout Icon</div>
}));

const mockStore = configureStore([]);

describe('Navbar Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { email: 'test@example.com' }
      }
    });
  });

  test('renders navbar with all icons', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
  });
});