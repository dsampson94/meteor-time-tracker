import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const ProjectTasks = new Mongo.Collection('projectTasks');

if (Meteor.isServer) {
    Meteor.publish('projectTasks', function projectTasksPublication() {
        return ProjectTasks.find({});
    });
}

Meteor.methods({
    'projectTasks.addTaskToProject'(projectId, taskId) {
        check(projectId, String);
        check(taskId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        ProjectTasks.insert({
            projectId,
            taskId,
            createdAt: new Date(),
        });
    },
    'projectTasks.removeTaskFromProject'(projectId, taskId) {
        check(projectId, String);
        check(taskId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        ProjectTasks.remove({ projectId, taskId });
    },
});
