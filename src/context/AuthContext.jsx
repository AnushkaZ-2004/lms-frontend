import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = authService.getCurrentUser();

        if (token && user) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token, user }
            });
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const login = async (email, password) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await authService.login(email, password);

            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: response
            });
        } catch (error) {
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.response?.data?.message || 'Login failed'
            });
        }
    };

    const logout = () => {
        authService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};