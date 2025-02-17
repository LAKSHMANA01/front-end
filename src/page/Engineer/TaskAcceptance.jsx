import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEngineerTasks, fetchAcceptTask, fetchRejectTask } from '../../redux/Slice/EngineerSlice';
import TaskCard from './TaskCard';
import Loading from "../../compoents/Loadingpage";

const AssignedTasks = ({ isExpanded }) => { 
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { tasks, loading, error } = useSelector((state) => state.engineer);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
        if (user.email) {
            dispatch(fetchEngineerTasks(user.email));
        }
    }, [user.email, user.role, dispatch]);

    useEffect(() => {
        setLocalTasks(Array.isArray(tasks) ? tasks :[]);
    }, [tasks]);

    const handleAcceptTask = (taskId) => {
        dispatch(fetchAcceptTask({ taskId, email: user.email }));
        setLocalTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, status: 'accepted' } : task
            )
        );
    };

    const handleRejectTask = (taskId) => {
        dispatch(fetchRejectTask({ taskId, email: user.email }))
            .then(() => {
                setLocalTasks(prevTasks =>
                    prevTasks.filter(task => task._id !== taskId)
                );
            })
            .catch((error) => {
                console.error('Error rejecting task:', error);
            });
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={`transition-all duration-300 ease-in-out p-4 ${isExpanded ? 'ml-[100px]' : 'ml-[40px]'}`}>
            <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localTasks.filter(task => task.status === 'pending').map((task) => (
                    <div key={task._id} className="w-full max-w-md bg-white rounded-lg shadow border p-4">
                        <TaskCard task={task} />
                        <div className="flex justify-between mt-2">
                            <button
                                onClick={() => handleAcceptTask(task._id)}
                                className="px-3 py-1 rounded bg-green-500 text-white transition hover:bg-green-600"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleRejectTask(task._id)}
                                className="px-3 py-1 rounded bg-red-500 text-white transition hover:bg-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold mt-6 mb-4">Accepted Tasks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localTasks.filter(task => task.status === 'accepted').map((task) => (
                    <div key={task._id} className="w-full max-w-md bg-white rounded-lg shadow border p-4">
                        <TaskCard task={task} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignedTasks;
