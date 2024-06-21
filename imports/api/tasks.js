import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define the TaskList collection
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
});
