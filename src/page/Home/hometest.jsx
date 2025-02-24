// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import LandingPage from './Homepage';

// // Mock navigate function
// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate
// }));

// // Mock sessionStorage
// const mockSessionStorage = {
//   getItem: jest.fn()
// };
// Object.defineProperty(window, 'sessionStorage', {
//   value: mockSessionStorage
// });

// // Test wrapper component
// const renderWithRouter = (component) => {
//   return render(
//     <BrowserRouter>
//       {component}
//     </BrowserRouter>
//   );
// };

// describe('LandingPage', () => {
//   beforeEach(() => {
//     // Clear all mocks before each test
//     jest.clearAllMocks();
//     mockSessionStorage.getItem.mockClear();
//   });

//   test('renders all main sections', () => {
//     renderWithRouter(<LandingPage />);
    
//     // Check for main headings
//     expect(screen.getByText('Telecom Infrastructure')).toBeInTheDocument();
//     expect(screen.getByText('Field Operations Platform')).toBeInTheDocument();
//     expect(screen.getByText('Core Platform Features')).toBeInTheDocument();
//     expect(screen.getByText('Operational Workflow')).toBeInTheDocument();
//   });

//   test('renders navigation links', () => {
//     renderWithRouter(<LandingPage />);
    
//     expect(screen.getByText('Features')).toBeInTheDocument();
//     expect(screen.getByText('Safety')).toBeInTheDocument();
//     expect(screen.getByText('Contact')).toBeInTheDocument();
//     expect(screen.getByText('Login')).toBeInTheDocument();
//   });

//   test('renders all features', () => {
//     renderWithRouter(<LandingPage />);
    
//     expect(screen.getByText('Fault Ticket Management')).toBeInTheDocument();
//     expect(screen.getByText('Engineer Allocation')).toBeInTheDocument();
//     expect(screen.getByText('Hazard Compliance')).toBeInTheDocument();
//     expect(screen.getByText('Multi-Device Access')).toBeInTheDocument();
//   });

//   test('renders workflow steps', () => {
//     renderWithRouter(<LandingPage />);
    
//     expect(screen.getByText('Ticket Creation')).toBeInTheDocument();
//     expect(screen.getByText('Smart Allocation')).toBeInTheDocument();
//     expect(screen.getByText('Resolution Tracking')).toBeInTheDocument();
//   });

//   test('handles "Raise Ticket" click when user is not authenticated', () => {
//     mockSessionStorage.getItem.mockReturnValue(null);
//     renderWithRouter(<LandingPage />);
    
//     const raiseTicketButton = screen.getByText('Raise Ticket');
//     fireEvent.click(raiseTicketButton);
    
//     expect(mockNavigate).toHaveBeenCalledWith('/login');
//   });

//   test('handles "Raise Ticket" click when user is authenticated as user', () => {
//     mockSessionStorage.getItem
//       .mockReturnValueOnce('token-value') // token
//       .mockReturnValueOnce('test@email.com') // email
//       .mockReturnValueOnce('user'); // role
    
//     renderWithRouter(<LandingPage />);
    
//     const raiseTicketButton = screen.getByText('Raise Ticket');
//     fireEvent.click(raiseTicketButton);
    
//     expect(mockNavigate).toHaveBeenCalledWith('/User/RaiseTicket');
//   });

//   test('handles "Raise Ticket" click when user is authenticated as admin', () => {
//     mockSessionStorage.getItem
//       .mockReturnValueOnce('token-value') // token
//       .mockReturnValueOnce('admin@email.com') // email
//       .mockReturnValueOnce('admin'); // role
    
//     renderWithRouter(<LandingPage />);
    
//     const raiseTicketButton = screen.getByText('Raise Ticket');
//     fireEvent.click(raiseTicketButton);
    
//     // Should show error toast instead of navigating
//     expect(mockNavigate).not.toHaveBeenCalled();
//   });

//   test('toggles mobile menu on hamburger click', () => {
//     // Set viewport to mobile size
//     window.innerWidth = 500;
//     renderWithRouter(<LandingPage />);
    
//     const hamburgerButton = screen.getByRole('button', { name: '' });
//     fireEvent.click(hamburgerButton);
    
//     // Check if mobile menu items are visible
//     const mobileMenu = screen.getAllByText('Features')[1]; // Gets the mobile menu item
//     expect(mobileMenu).toBeVisible();
//   });

//   test('renders footer content', () => {
//     renderWithRouter(<LandingPage />);
    
//     expect(screen.getByText('TelecomFieldOps')).toBeInTheDocument();
//     expect(screen.getByText('Solutions')).toBeInTheDocument();
//     expect(screen.getByText('Company')).toBeInTheDocument();
//     expect(screen.getByText('Legal')).toBeInTheDocument();
//     expect(screen.getByText(/© 2024 TelecomFieldOps/)).toBeInTheDocument();
//   });
// });