import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
                alert(err.reason);
            } else {
                history.push('/');
            }
        });
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
};

export default Login;
