import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';

const TaskList = () => {
    const tasks = useTracker(() => {
        Meteor.subscribe('tasks');
        return Tasks.find({}, { sort: { createdAt: -1 } }).fetch();
    });

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [newDescription, setNewDescription] = useState('');
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval;
        if (activeTaskId) {
            interval = setInterval(() => {
                const task = Tasks.findOne(activeTaskId);
                if (task && task.isActive && task.startTime) {
                    const currentTime = new Date();
                    setElapsedTime(task.elapsedTime + (currentTime - task.startTime));
                }
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(interval);
    }, [activeTaskId, tasks]);

    const handleEdit = (task) => {
        setEditingTaskId(task._id);
        setNewDescription(task.description);
    };

    const handleUpdate = (taskId) => {
        Meteor.call('tasks.update', taskId, newDescription, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            } else {
                setEditingTaskId(null);
                setNewDescription('');
            }
        });
    };

    const handleDelete = (taskId) => {
        Meteor.call('tasks.remove', taskId, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            }
        });
    };

    const handleStart = (taskId) => {
        Meteor.call('tasks.start', taskId, (error) => {
            if (!error) {
                setActiveTaskId(taskId);
            }
        });
    };

    const handleStop = (taskId) => {
        Meteor.call('tasks.stop', taskId, (error) => {
            if (!error) {
                setActiveTaskId(null);
            }
        });
    };

    const handleReset = (taskId) => {
        Meteor.call('tasks.reset', taskId, (error) => {
            if (!error) {
                setActiveTaskId(null);
            }
        });
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <ul>
            {tasks.map(task => (
                <li key={task._id}>
                    {editingTaskId === task._id ? (
                        <>
                            <input
                                type="text"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                            <button className="save" onClick={() => handleUpdate(task._id)}>Save</button>
                            <button className="cancel" onClick={() => setEditingTaskId(null)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <div>
                                <div>{task.description}: {task._id === activeTaskId ? formatTime(elapsedTime) : formatTime(task.elapsedTime)}</div>
                            </div>
                            <div>
                                {task.isActive ? (
                                    <button className="stop" onClick={() => handleStop(task._id)}>Stop</button>
                                ) : (
                                    <button className="start" onClick={() => handleStart(task._id)}>Start</button>
                                )}
                                <button className="reset" onClick={() => handleReset(task._id)}>Reset</button>
                                <button className="edit" onClick={() => handleEdit(task)}>Edit</button>
                                <button className="delete" onClick={() => handleDelete(task._id)}>Delete</button>
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
