import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Projects } from '../api/projects';
import { Tasks } from '../api/tasks';
import { ProjectTasks } from '../api/projectTasks';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const ProjectList = () => {
    const projects = useTracker(() => {
        Meteor.subscribe('projects');
        return Projects.find({}, { sort: { createdAt: -1 } }).fetch();
    });

    const projectTasks = useTracker(() => {
        Meteor.subscribe('projectTasks');
        return ProjectTasks.find().fetch();
    });

    const tasks = useTracker(() => {
        Meteor.subscribe('tasks');
        return Tasks.find().fetch();
    });

    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const handleDelete = (projectId) => {
        Meteor.call('projects.remove', projectId, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            }
        });
    };

    return (
        <div>
            <h2>Projects</h2>
            <ul>
                {projects.map(project => {
                    const associatedTasks = projectTasks
                        .filter(pt => pt.projectId === project._id)
                        .map(pt => tasks.find(task => task._id === pt.taskId))
                        .filter(task => task); // filter out undefined tasks

                    return (
                        <li key={ project._id }>
              <span onClick={ () => setSelectedProjectId(project._id) }>
                { project.name }
              </span>
                            <ul>
                                { associatedTasks.map(task => (
                                    <li key={ task._id }>{ task.description }</li>
                                )) }
                            </ul>
                            <button onClick={ () => handleDelete(project._id) }>Delete</button>

                        </li>
                    );
                }) }
            </ul>
            { selectedProjectId && (
                <>
                    <TaskForm projectId={selectedProjectId} />
                    <TaskList projectId={selectedProjectId} />
                </>
            )}
        </div>
    );
};

export default ProjectList;
