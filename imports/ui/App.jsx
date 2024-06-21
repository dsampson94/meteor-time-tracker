import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';

const App = () => {
    const user = useTracker(() => Meteor.user());

    return (
        <div className="container">
            <LogoutButton />
            <header>
                <h1>SovTech Time Tracker</h1>
                {user ? (
                    <>
                        <TaskForm />
                        <TaskList />
                    </>
                ) : (
                    <LoginForm />
                )}
            </header>
        </div>
    );
};

export default App;
