import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AssignedTasks from '../AssignedTasks'; // Adjust the path as needed
import { fetchEngineerTasks, updateTaskStatus } from '../../redux/Slice/EngineerSlice';
import { sendNotification } from '../../redux/Slice/notificationSlice';

jest.mock('../../redux/Slice/EngineerSlice', () => ({
    fetchEngineerTasks: jest.fn(),
    updateTaskStatus: jest.fn()
}));

jest.mock('../../redux/Slice/notificationSlice', () => ({
    sendNotification: jest.fn()
}));

const mockStore = configureStore([]);

describe('AssignedTasks Component', () => {
    let store;
    beforeEach(() => {
        store = mockStore({
            auth: { user: { email: 'test@example.com', role: 'engineer' } },
            engineer: { tasks: [], loading: false, error: null }
        });
        store.dispatch = jest.fn();
    });

    test('renders loading state', () => {
        store = mockStore({ auth: { user: {} }, engineer: { loading: true } });
        render(
            <Provider store={store}>
                <AssignedTasks isExpanded={true} />
            </Provider>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders error message', () => {
        store = mockStore({ auth: { user: {} }, engineer: { error: { message: 'Failed to fetch' } } });
        render(
            <Provider store={store}>
                <AssignedTasks isExpanded={true} />
            </Provider>
        );
        expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument();
    });

    test('fetches tasks on mount', () => {
        render(
            <Provider store={store}>
                <AssignedTasks isExpanded={true} />
            </Provider>
        );
        expect(store.dispatch).toHaveBeenCalledWith(fetchEngineerTasks('test@example.com'));
    });

    test('renders assigned tasks', () => {
        store = mockStore({
            auth: { user: { email: 'test@example.com' } },
            engineer: {
                tasks: [{ _id: '1', title: 'Fix Router', status: 'open', accepted: true }],
                loading: false,
                error: null
            }
        });
        render(
            <Provider store={store}>
                <AssignedTasks isExpanded={true} />
            </Provider>
        );
        expect(screen.getByText(/fix router/i)).toBeInTheDocument();
    });

    test('opens and closes task modal', async () => {
        store = mockStore({
            auth: { user: { email: 'test@example.com' } },
            engineer: {
                tasks: [{ _id: '1', title: 'Fix Router', status: 'open', accepted: true }],
                loading: false,
                error: null
            }
        });
        render(
            <Provider store={store}>
                <AssignedTasks isExpanded={true} />
            </Provider>
        );
        fireEvent.click(screen.getByText(/fix router/i));
        expect(screen.getByText(/change task status/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('✕'));
        await waitFor(() => expect(screen.queryByText(/change task status/i)).not.toBeInTheDocument());
    });

    test('updates task status and sends notification', async () => {
        store = mockStore({
            auth: { user: { email: 'test@example.com' } },
            engineer: {
                tasks: [{ _id: '1', title: 'Fix Router', status: 'open', accepted: true }],
                loading: false,
                error: null
            }
        });
        render(
            <Provider store={store}>
                <AssignedTasks isExpanded={true} />
            </Provider>
        );

        fireEvent.click(screen.getByText(/fix router/i));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'deferred' } });
        fireEvent.click(screen.getByText(/update status/i));

        await waitFor(() => expect(updateTaskStatus).toHaveBeenCalledWith({ taskId: '1', status: 'deferred' }));
        await waitFor(() => expect(sendNotification).toHaveBeenCalledWith({
            userId: '1',
            messageTOSend: 'Task "Fix Router" has been deferred by test@example.com',
            isRead: false
        }));
    });
});
