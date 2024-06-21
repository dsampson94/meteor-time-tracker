import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';

const TaskList = () => {
    const tasks = useTracker(() => {
        Meteor.subscribe('tasks');
        return Tasks.find({}, { sort: { createdAt: -1 } }).fetch();
    });

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [newDescription, setNewDescription] = useState('');

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
                            {task.description}
                            <button className="edit" onClick={() => handleEdit(task)}>Edit</button>
                            <button className="delete" onClick={() => handleDelete(task._id)}>Delete</button>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
