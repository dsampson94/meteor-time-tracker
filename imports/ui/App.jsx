import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';

const App = () => {
    const user = useTracker(() => Meteor.user());
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        Meteor.loginWithPassword(email, password, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            }
        });
    };

    const handleLogout = () => {
        Meteor.logout();
    };

    const handleSignup = (e) => {
        e.preventDefault();
        Accounts.createUser({ email, password }, (error) => {
            if (error) {
                alert(error.reason || error.message || 'An error occurred');
            }
        });
    };

    return (
        <div className="container">
            <header>
                <h1>SovTech Project Manager</h1>
                {user ? (
                    <div className="profile">
                        <div className="profile-icon">
                            {user?.emails[0]?.address}
                        </div>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <button type="submit" style={{ marginRight: '10px' }}>
                            Login
                        </button>
                        <button onClick={handleSignup} style={{ whiteSpace: 'nowrap' }}>
                            Sign Up
                        </button>
                    </form>
                )}
            </header>
            {user && (
                <>
                    <ProjectForm />
                    <ProjectList />
                </>
            )}
        </div>
    );
};

export default App;
