import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks';
import { ProjectTasks } from '../api/projectTasks';
import { Projects } from '../api/projects';

const TaskList = () => {
    // Fetch all project-tasks associations
    const projectTasks = useTracker(() => {
        Meteor.subscribe('projectTasks');
        return ProjectTasks.find().fetch();
    });

    // Fetch all tasks associated with the user
    const taskIds = projectTasks.map(pt => pt.taskId);
    const tasks = useTracker(() => {
        Meteor.subscribe('tasks', taskIds);
        return Tasks.find({ _id: { $in: taskIds } }, { sort: { createdAt: -1 } }).fetch();
    });

    // Fetch all projects
    const projects = useTracker(() => {
        Meteor.subscribe('projects');
        return Projects.find().fetch();
    });

    // Create a map of project IDs to project names
    const projectMap = projects.reduce((acc, project) => {
        acc[project._id] = project.name;
        return acc;
    }, {});

    const handleDelete = (taskId) => {
        Meteor.call('tasks.remove', taskId, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            } else {
                const projectTask = projectTasks.find(pt => pt.taskId === taskId);
                if (projectTask) {
                    Meteor.call('projectTasks.removeTaskFromProject', projectTask.projectId, taskId);
                }
            }
        });
    };

    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => {
                    const projectTask = projectTasks.find(pt => pt.taskId === task._id);
                    const projectName = projectTask ? projectMap[projectTask.projectId] : 'No Project';
                    return (
                        <li key={task._id}>
                            {task.description} - <strong>{projectName}</strong>
                            <button onClick={() => handleDelete(task._id)}>Delete</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TaskList;
