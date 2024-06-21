import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegistering) {
            Accounts.createUser({ email, password }, (err) => {
                if (err) {
                    alert(err.reason);
                }
            });
        } else {
            Meteor.loginWithPassword(email, password, (err) => {
                if (err) {
                    alert(err.reason);
                }
            });
        }
    };

    return (
        <div>
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
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Switch to Login' : 'Switch to Register'}
            </button>
        </div>
    );
};

export default LoginForm;
