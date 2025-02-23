import { render, screen } from '@testing-library/react';
import UserDashboard from './Dashbord';  // Ensure the import path is correct

// Mocking Dashboard component since we're not passing data
jest.mock('./../../compoents/Dashbord', () => {
  return () => <div>Mocked Dashboard</div>;
});

describe('UserDashboard', () => {
  test('renders Dashboard component correctly without props', () => {
    render(<UserDashboard />);

    // Check if the mocked Dashboard is rendered
    expect(screen.getByText('Mocked Dashboard')).toBeInTheDocument();
  });
});
