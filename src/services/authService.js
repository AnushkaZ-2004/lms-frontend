import { apiInstances } from './api';

export const authService = {
    login: async (email, password) => {
        try {
            console.log('Attempting login with:', { email }); // Don't log password

            const response = await apiInstances.auth.post('/login', {
                email,
                password
            });

            console.log('Login response:', response.data);

            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('authToken', 'session-based');

                return {
                    success: true,
                    user: response.data.user,
                    token: 'session-based'
                };
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);

            let errorMessage = 'Login failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        try {
            await apiInstances.auth.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    verifySession: async () => {
        try {
            const response = await apiInstances.auth.get('/me');
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                return response.data;
            }
            return null;
        } catch (error) {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            return null;
        }
    }
};