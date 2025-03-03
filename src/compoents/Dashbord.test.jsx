// Dashboard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashbord';

// Dummy data for the Dashboard cards
const dummyData = {
  openTickets: [1, 2, 3],
  allTasks: [1, 2],
  failedTasks: [1],
  inprogressTasks: [1, 2, 3, 4],
  allEngineers: [1, 2, 3, 4],
  resolvedTickets: [1, 2],
  approvedEngineers: [1, 2],
  completedTasks: [1],
  pendingTasks: [],
  totalTasks: [1, 2, 3, 4, 5],
  activeEngineers: [],
  allHazards: [1, 2, 3],
};

// Valid and invalid chart data for the Bar charts
const ticketStatusDataValid = { labels: ['A', 'B'], datasets: [] };
const taskPriorityDataValid = { labels: ['X', 'Y'], datasets: [] };
const ticketStatusDataInvalid = {}; // missing labels
const taskPriorityDataInvalid = {};

// --- Mocks ---

// Mock the Card component so we can inspect the props passed by Dashboard.
jest.mock('./Card', () => (props) => (
  <div data-testid="card" data-title={props.title} data-value={props.value}>
    {props.icon}
  </div>
));

// Mock the Bar chart component. It will render a div with text "Chart" if valid data is provided.
jest.mock('react-chartjs-2', () => ({
  Bar: (props) => (
    <div data-testid="bar-chart" data-data={JSON.stringify(props.data)}>
      {props.data && props.data.labels ? 'Chart' : null}
    </div>
  ),
  Pie: () => <div>Pie</div>,
}));

// Mock ToastContainer to verify it is rendered.
jest.mock('react-toastify', () => ({
  ToastContainer: (props) => <div data-testid="toast-container" {...props} />,
}));

// --- Test Suite ---
describe('Dashboard Component', () => {
  // Clear sessionStorage before each test so that each test can set its own role.
  beforeEach(() => {
    sessionStorage.clear();
  });

  // Helper function to render the Dashboard with desired props and role.
  const renderDashboard = (role, ticketStatusData, taskPriorityData) => {
    sessionStorage.setItem('role', role);
    return render(
      <Dashboard
        ticketStatusData={ticketStatusData}
        taskPriorityData={taskPriorityData}
        data={dummyData}
      />
    );
  };

  test('renders the header "Dashboard"', () => {
    renderDashboard('user', ticketStatusDataValid, taskPriorityDataValid);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders user role cards correctly', () => {
    renderDashboard('user', ticketStatusDataValid, taskPriorityDataValid);
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(4);

    // For "user" role, the card configuration should be:
    // - Total Tickets: totalTasks.length === 5
    // - Completed Tickets: completedTasks.length === 1
    // - Pending Tickets: totalTasks.length + inprogressTasks.length === 5 + 4 = 9
    // - Failed Tickets: failedTasks.length === 1
    expect(cards[0]).toHaveAttribute('data-title', 'Total Tickets');
    expect(cards[0]).toHaveAttribute('data-value', '5');

    expect(cards[1]).toHaveAttribute('data-title', 'Completed Tickets');
    expect(cards[1]).toHaveAttribute('data-value', '1');

    expect(cards[2]).toHaveAttribute('data-title', 'Pending Tickets');
    expect(cards[2]).toHaveAttribute('data-value', '9');

    expect(cards[3]).toHaveAttribute('data-title', 'Failed Tickets');
    expect(cards[3]).toHaveAttribute('data-value', '1');
  });

  test('renders engineer role cards correctly', () => {
    renderDashboard('engineer', ticketStatusDataValid, taskPriorityDataValid);
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(4);

    // For "engineer" role, the configuration should be:
    // - My Active Tickets: allTasks.length === 2
    // - Pending Tickets: allTasks.length + inprogressTasks.length === 2 + 4 = 6
    // - Completed Tickets: resolvedTickets.length === 2
    // - All Hazards: allHazards.length === 3
    expect(cards[0]).toHaveAttribute('data-title', 'My Active Tickets');
    expect(cards[0]).toHaveAttribute('data-value', '2');

    expect(cards[1]).toHaveAttribute('data-title', 'Pending Tickets');
    expect(cards[1]).toHaveAttribute('data-value', '6');

    expect(cards[2]).toHaveAttribute('data-title', 'Completed Tickets');
    expect(cards[2]).toHaveAttribute('data-value', '2');

    expect(cards[3]).toHaveAttribute('data-title', 'All Hazards');
    expect(cards[3]).toHaveAttribute('data-value', '3');
  });

  test('renders admin role cards correctly', () => {
    renderDashboard('admin', ticketStatusDataValid, taskPriorityDataValid);
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(4);

    // For "admin" role, the configuration should be:
    // - Open Tickets: openTickets.length === 3
    // - Resolved Tickets: resolvedTickets.length === 2
    // - New Engineers: allEngineers.length - approvedEngineers.length === 4 - 2 = 2
    // - Approved Engineers: approvedEngineers.length === 2
    expect(cards[0]).toHaveAttribute('data-title', 'Open Tickets');
    expect(cards[0]).toHaveAttribute('data-value', '3');

    expect(cards[1]).toHaveAttribute('data-title', 'Resolved Tickets');
    expect(cards[1]).toHaveAttribute('data-value', '2');

    expect(cards[2]).toHaveAttribute('data-title', 'New Engineers');
    expect(cards[2]).toHaveAttribute('data-value', '2');

    expect(cards[3]).toHaveAttribute('data-title', 'Approved Engineers');
    expect(cards[3]).toHaveAttribute('data-value', '2');
  });

  test('renders "No data available" when role is not recognized', () => {
    renderDashboard('other', ticketStatusDataValid, taskPriorityDataValid);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('renders valid Bar charts when data is provided', () => {
    renderDashboard('user', ticketStatusDataValid, taskPriorityDataValid);
    const barCharts = screen.getAllByTestId('bar-chart');
    // Two charts should be rendered (one for ticket status and one for task priority)
    expect(barCharts.length).toBe(2);
    barCharts.forEach((chart) => {
      expect(chart).toHaveTextContent('Chart');
    });
  });

  test('renders fallback text for ticketStatusData and taskPriorityData when labels are missing', () => {
    renderDashboard('user', ticketStatusDataInvalid, taskPriorityDataInvalid);
    // When labels are missing, fallback texts should be rendered.
    expect(screen.getByText('No Ticket Data')).toBeInTheDocument();
    expect(screen.getByText('No Task Priority Data')).toBeInTheDocument();
  });

  test('renders the ToastContainer', () => {
    renderDashboard('user', ticketStatusDataValid, taskPriorityDataValid);
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('matches the snapshot', () => {
    const { container } = renderDashboard('admin', ticketStatusDataValid, taskPriorityDataValid);
    expect(container).toMatchSnapshot();
  });
});