import { apiInstances } from './api';

export const authService = {
    login: async (email, password) => {
        const response = await apiInstances.auth.post('/login', { email, password });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};