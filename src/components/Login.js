import React, { useState } from 'react';

function Login({ onLogin, api }) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await api.login(credentials.email, credentials.password);
            if (result.user.role === 'ADMIN') {
                onLogin(result.user);
            } else {
                setError('Access denied. Admin role required.');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>LMS Admin Portal</h1>
                    <p>Sign in to access the admin dashboard</p>
                </div>

                <div className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button onClick={handleSubmit} className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;