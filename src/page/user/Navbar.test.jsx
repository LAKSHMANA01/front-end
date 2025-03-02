import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar Component', () => {
  const toggleSidebarMock = jest.fn();

  beforeEach(() => {
    // Set an email in sessionStorage so that the component renders a user name.
    sessionStorage.setItem("email", "test@example.com");
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Navbar toggleSidebar={toggleSidebarMock} />
      </MemoryRouter>
    );

  it('renders the Navbar with the Telecom Services heading', () => {
    renderComponent();
    expect(screen.getByText(/Telecom Services/i)).toBeInTheDocument();
  });

  it('displays the correct user name based on sessionStorage email', () => {
    renderComponent();
    // The name is derived by splitting the email at "@" so it should be "test"
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('calls toggleSidebar when the mobile menu button is clicked', () => {
    // Render the component and grab the container so we can query by class
    const { container, getAllByRole } = renderComponent();

    // The mobile menu button is the one with the "md:hidden" class.
    // You can select it by querying all buttons and assuming the first one is the mobile menu button.
    const buttons = getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(toggleSidebarMock).toHaveBeenCalled();
  });

  it('toggles the profile dropdown when the profile button is clicked', () => {
    renderComponent();

    // Initially, the dropdown with the logout link should not be visible.
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();

    // Find the profile button using the displayed user name.
    const profileButton = screen.getByText('test').closest('button');
    expect(profileButton).toBeInTheDocument();

    // Click the profile button to open the dropdown.
    fireEvent.click(profileButton);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();

    // Click again to close the dropdown.
    fireEvent.click(profileButton);
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
  });
});