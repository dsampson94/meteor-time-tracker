import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

const TaskForm = () => {
    const [description, setDescription] = useState('');
    const user = useTracker(() => Meteor.user());

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to add a task!');
            return;
        }

        Meteor.call('tasks.insert', description, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            } else {
                setDescription('');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;
