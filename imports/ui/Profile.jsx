import React from 'react';
import { Meteor } from 'meteor/meteor';

const Profile = () => {
    const user = Meteor.user();

    const handleLogout = () => {
        Meteor.logout();
    };

    return (
        <div className="profile">
            <div className="profile-icon">
                {user?.emails[0]?.address.charAt(0).toUpperCase()}
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Profile;
