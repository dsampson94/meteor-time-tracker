import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define the Tasks collection
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({ owner: this.userId });
    });
}

Meteor.methods({
    'tasks.insert'(description) {
        check(description, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            description,
            createdAt: new Date(),
            owner: this.userId,
            isActive: false,
            startTime: null,
            elapsedTime: 0,
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);
    },
    'tasks.update'(taskId, newDescription) {
        check(taskId, String);
        check(newDescription, String);

        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { description: newDescription } });
    },
    'tasks.start'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { isActive: true, startTime: new Date() } });
    },
    'tasks.stop'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        const currentTime = new Date();
        const elapsedTime = task.elapsedTime + (currentTime - task.startTime);

        Tasks.update(taskId, { $set: { isActive: false, elapsedTime: elapsedTime } });
    },
    'tasks.reset'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { isActive: false, startTime: null, elapsedTime: 0 } });
    },
});
