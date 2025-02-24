import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEngineerTasks, fetchAcceptTask, fetchRejectTask } from '../../redux/Slice/EngineerSlice';
import TaskCard from './TaskCard';
import Loading from "../../compoents/Loadingpage";

const TaskAcceptance = ({ isExpanded }) => { 
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { tasks, loading, error } = useSelector((state) => state.engineer);
    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
        if (user && user.email) {
            dispatch(fetchEngineerTasks(user.email));
        }
    }, [user.email, dispatch]);

    useEffect(() => {
        if(Array.isArray(tasks)){
        setLocalTasks(tasks.filter(task => !task.accepted));
     } // Filter tasks that are not accepted
     else{
        setLocalTasks([]); // Clear local state when tasks update
     }
    }, [tasks]);

    const handleAcceptTask = (taskId) => {
        try{
        console.log("Accepting taskId:", taskId, "Type:", typeof taskId);
        console.log("User email:", user.email);

        const taskIdString = String(taskId);
        // console.log("taskId: ",taskId,typeof(taskId));
        // console.log('User email:', user.email);
        dispatch(fetchAcceptTask({ taskId, email: user.email }))
        setLocalTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId? { ...task, accepted: true } : task
            )
        );

        dispatch(fetchEngineerTasks())
        
    }catch(error){
        console.error("Error accepting task:", error);
    }
    };

    const handleRejectTask = async (taskId) => {
        try {
            const taskIdString = String(taskId);
            console.log("Rejecting taskId:", taskIdString);

            const response = await dispatch(fetchRejectTask({ taskId: taskIdString, email: user.email })).unwrap();

            if ( response && response.success) {
                setLocalTasks((prevTasks) => prevTasks.filter(task => String(task._id) !== taskId));
            } else {
                console.error("Task rejection failed:", response.message);
            }
        } catch (error) {
            console.error("Error rejecting task:", error);
        }
    };

    if (loading) return <Loading />;
    //if (error) return <div>Error: {error}</div>;
    //if (error) return <div className="text-red-500">Error: {typeof error === 'object' ? JSON.stringify(error) : error}</div>;


    return (
        <div className={`transition-all duration-300 ease-in-out p-4 ${isExpanded ? 'ml-[100px]' : 'ml-[40px]'}`}>
            <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localTasks.length === 0 ? (
                    <div className="text-gray-500">No tasks found.</div>
                ) : (
                    localTasks.map((task) => (
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
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskAcceptance;
