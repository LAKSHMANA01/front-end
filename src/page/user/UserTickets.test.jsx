// src/page/user/UserTickets.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserTicketList from './UserTickets';
import Notasksimage from '../../assets/NoTasks.png';


const mockStore = configureStore([]);

describe('UserTicketList Component', () => {
  const initialState = {
    auth: { 
      user: { email: 'test@example.com', role: 'user' } 
    },
    tickets: { 
      tasks: [], 
      loading: false, 
      error: null 
    }
  };

  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders loading state', () => {
    const loadingState = {
      ...initialState,
      tickets: { ...initialState.tickets, loading: true }
    };
    store = mockStore(loadingState);

    render(
      <Provider store={store}>
        <UserTicketList />
      </Provider>
    );
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorState = {
      ...initialState,
      tickets: { ...initialState.tickets, error: 'Error message' }
    };
    store = mockStore(errorState);

    render(
      <Provider store={store}>
        <UserTicketList />
      </Provider>
    );
    
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(
      <Provider store={store}>
        <UserTicketList />
      </Provider>
    );
    
    expect(screen.getByAltText('No Tasks')).toBeInTheDocument();
  });
});
module.exports = 'test-file-stub';
