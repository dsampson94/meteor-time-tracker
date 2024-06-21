import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Tasks } from './tasks';
import { ProjectTasks } from './projectTasks';

export const Projects = new Mongo.Collection('projects');

if (Meteor.isServer) {
    Meteor.publish('projects', function projectsPublication() {
        return Projects.find({ owner: this.userId });
    });
}

Meteor.methods({
    'projects.insert'(name) {
        check(name, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Projects.insert({
            name,
            createdAt: new Date(),
            owner: this.userId,
        });
    },
    'projects.remove'(projectId) {
        check(projectId, String);

        const project = Projects.findOne(projectId);
        if (project.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        // Cascade delete tasks associated with the project
        ProjectTasks.find({ projectId }).forEach((projectTask) => {
            Tasks.remove(projectTask.taskId);
            ProjectTasks.remove(projectTask._id);
        });

        Projects.remove(projectId);
    },
});
