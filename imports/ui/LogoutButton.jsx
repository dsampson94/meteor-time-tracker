import React from 'react';
import { Meteor } from 'meteor/meteor';

const LogoutButton = () => {
    return (
        <button onClick={() => Meteor.logout()}>Logout</button>
    );
};

export default LogoutButton;
