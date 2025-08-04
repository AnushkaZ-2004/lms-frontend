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
            console.log('Attempting login with:', credentials.email);

            const result = await api.login(credentials.email, credentials.password);
            console.log('Login result:', result);

            if (result.success && result.user) {
                console.log('User role:', result.user.role);

                // Call onLogin with the user data
                onLogin(result.user);

                console.log('Login successful, should redirect to:', result.user.role, 'dashboard');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid credentials. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.loginBox}>
                <div style={styles.loginHeader}>
                    <h1 style={styles.loginTitle}>LMS Portal</h1>
                    <p style={styles.loginSubtitle}>Sign in to access your dashboard</p>
                </div>

                <div style={styles.loginForm}>
                    {error && <div style={styles.errorMessage}>{error}</div>}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                            placeholder="your@email.com"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            placeholder="Enter your password"
                            style={styles.input}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        style={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>


            </div>
        </div>
    );
}

const styles = {
    loginContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
    },
    loginBox: {
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    loginHeader: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    loginTitle: {
        color: '#2563eb',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '10px',
        margin: 0
    },
    loginSubtitle: {
        color: '#64748b',
        fontSize: '14px',
        margin: 0
    },
    loginForm: {
        marginBottom: '20px'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#374151',
        fontWeight: '500',
        fontSize: '14px'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box'
    },
    loginButton: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    errorMessage: {
        background: '#fef2f2',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #fecaca',
        marginBottom: '20px',
        fontSize: '14px'
    },
    roleInfo: {
        textAlign: 'center',
        padding: '15px',
        background: '#f8fafc',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    testCredentials: {
        background: '#f0fdf4',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #bbf7d0'
    }
};

export default Login;