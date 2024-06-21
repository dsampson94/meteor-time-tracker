import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Projects } from '../api/projects';
import { Tasks } from '../api/tasks';

const TaskForm = ({ projectId }) => {
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');

    const projects = useTracker(() => {
        Meteor.subscribe('projects');
        return Projects.find({}, { sort: { createdAt: -1 } }).fetch();
    });

    const tasks = useTracker(() => {
        Meteor.subscribe('tasks');
        return Tasks.find({}, { sort: { createdAt: -1 } }).fetch();
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProjectId) {
            alert('Please select a project.');
            return;
        }
        if (selectedTaskId) {
            Meteor.call('projectTasks.addTaskToProject', selectedProjectId, selectedTaskId, (error) => {
                if (error) {
                    alert(error.reason || error.message || 'An error occurred');
                } else {
                    setTaskDescription('');
                    setSelectedTaskId('');
                }
            });
        } else {
            Meteor.call('tasks.insert', taskDescription, (error, taskId) => {
                if (error) {
                    alert(error.reason || error.message || 'An error occurred');
                } else {
                    setTaskDescription('');
                    Meteor.call('projectTasks.addTaskToProject', selectedProjectId, taskId);
                }
            });
        }
    };

    return (
        <div>
            {projects.length > 0 ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Task description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <select
                        value={selectedTaskId}
                        onChange={(e) => setSelectedTaskId(e.target.value)}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="">Select Existing Task</option>
                        {tasks.map((task) => (
                            <option key={task._id} value={task._id}>
                                {task.description}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" style={{ marginRight: '10px' }}>
                        Add Task
                    </button>
                </form>
            ) : (
                <p>No projects available. Please create a project first.</p>
            )}
        </div>
    );
};

export default TaskForm;
