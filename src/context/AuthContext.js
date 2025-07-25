import { createContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const response = await AuthService.checkAuth();
            setUser(response.data);
            localStorage.setItem('lms_user', JSON.stringify(response.data));
        } catch (error) {
            localStorage.removeItem('lms_user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('lms_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) => {
        try {
            const response = await AuthService.login(email, password);
            setUser(response.data);
            localStorage.setItem('lms_user', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } finally {
            setUser(null);
            localStorage.removeItem('lms_user');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}