import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const ProjectForm = () => {
    const [projectName, setProjectName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        Meteor.call('projects.insert', projectName, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            } else {
                setProjectName('');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
            />
            <button type="submit">Add Project</button>
        </form>
    );
};

export default ProjectForm;
