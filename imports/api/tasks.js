import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

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

        return Tasks.insert({
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
});
