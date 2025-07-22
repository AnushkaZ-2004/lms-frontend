import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { lecturerService } from '../services/lecturerService';
import { courseService } from '../services/courseService';
import { assignmentService } from '../services/assignmentService';

const AppContext = createContext();

// App state reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };

        case 'SET_GLOBAL_STATS':
            return {
                ...state,
                globalStats: action.payload,
                loading: false
            };

        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload
            };

        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [action.payload, ...state.notifications]
            };

        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload)
            };

        case 'SET_THEME':
            return {
                ...state,
                theme: action.payload
            };

        case 'SET_SIDEBAR_COLLAPSED':
            return {
                ...state,
                sidebarCollapsed: action.payload
            };

        case 'SET_RECENT_ACTIVITIES':
            return {
                ...state,
                recentActivities: action.payload
            };

        case 'ADD_RECENT_ACTIVITY':
            return {
                ...state,
                recentActivities: [action.payload, ...state.recentActivities.slice(0, 9)]
            };

        case 'SET_APP_SETTINGS':
            return {
                ...state,
                appSettings: { ...state.appSettings, ...action.payload }
            };

        case 'SET_CACHE':
            return {
                ...state,
                cache: { ...state.cache, [action.key]: action.payload }
            };

        case 'CLEAR_CACHE':
            return {
                ...state,
                cache: {}
            };

        default:
            return state;
    }
};

// Initial state
const initialState = {
    loading: false,
    error: null,
    globalStats: {
        totalStudents: 0,
        totalLecturers: 0,
        totalCourses: 0,
        totalSubmissions: 0,
        totalQuizzes: 0,
        totalAnnouncements: 0
    },
    notifications: [],
    theme: 'light',
    sidebarCollapsed: false,
    recentActivities: [],
    appSettings: {
        appName: 'Learning Management System',
        logo: null,
        enableNotifications: true,
        autoRefresh: true,
        refreshInterval: 300000, // 5 minutes
        dateFormat: 'MMM dd, yyyy',
        timeFormat: '12h'
    },
    cache: {}
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load app settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('lms_app_settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                dispatch({ type: 'SET_APP_SETTINGS', payload: settings });
            } catch (error) {
                console.error('Error loading app settings:', error);
            }
        }

        const savedTheme = localStorage.getItem('lms_theme');
        if (savedTheme) {
            dispatch({ type: 'SET_THEME', payload: savedTheme });
        }

        const savedSidebarState = localStorage.getItem('lms_sidebar_collapsed');
        if (savedSidebarState) {
            dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: JSON.parse(savedSidebarState) });
        }
    }, []);

    // Auto-refresh global stats
    useEffect(() => {
        if (state.appSettings.autoRefresh) {
            const interval = setInterval(() => {
                fetchGlobalStats();
            }, state.appSettings.refreshInterval);

            return () => clearInterval(interval);
        }
    }, [state.appSettings.autoRefresh, state.appSettings.refreshInterval]);

    // Fetch global statistics
    const fetchGlobalStats = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const [studentsRes, lecturersRes, coursesRes, assignmentsRes] = await Promise.allSettled([
                studentService.getAllStudents(0, 1),
                lecturerService.getAllLecturers(0, 1),
                courseService.getAllCourses(0, 1),
                assignmentService.getAllAssignments(0, 1)
            ]);

            const stats = {
                totalStudents: studentsRes.status === 'fulfilled' ? studentsRes.value.totalElements || 0 : 0,
                totalLecturers: lecturersRes.status === 'fulfilled' ? lecturersRes.value.totalElements || 0 : 0,
                totalCourses: coursesRes.status === 'fulfilled' ? coursesRes.value.totalElements || 0 : 0,
                totalSubmissions: assignmentsRes.status === 'fulfilled' ? assignmentsRes.value.totalElements || 0 : 0,
                totalQuizzes: 0, // Will be updated when quiz service is called
                totalAnnouncements: 0 // Will be updated when announcement service is called
            };

            dispatch({ type: 'SET_GLOBAL_STATS', payload: stats });
        } catch (error) {
            console.error('Error fetching global stats:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch global statistics' });
        }
    };

    // Show notification
    const showNotification = (message, type = 'info', duration = 5000) => {
        const notification = {
            id: Date.now(),
            message,
            type, // 'success', 'error', 'warning', 'info'
            timestamp: new Date()
        };

        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

        if (duration > 0) {
            setTimeout(() => {
                dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
            }, duration);
        }
    };

    // Remove notification
    const removeNotification = (id) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    };

    // Clear all notifications
    const clearNotifications = () => {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
    };

    // Set theme
    const setTheme = (theme) => {
        dispatch({ type: 'SET_THEME', payload: theme });
        localStorage.setItem('lms_theme', theme);
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        const newState = !state.sidebarCollapsed;
        dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: newState });
        localStorage.setItem('lms_sidebar_collapsed', JSON.stringify(newState));
    };

    // Add recent activity
    const addRecentActivity = (activity) => {
        const activityWithTimestamp = {
            ...activity,
            id: Date.now(),
            timestamp: new Date()
        };
        dispatch({ type: 'ADD_RECENT_ACTIVITY', payload: activityWithTimestamp });
    };

    // Update app settings
    const updateAppSettings = (settings) => {
        const newSettings = { ...state.appSettings, ...settings };
        dispatch({ type: 'SET_APP_SETTINGS', payload: newSettings });
        localStorage.setItem('lms_app_settings', JSON.stringify(newSettings));
    };

    // Set cache
    const setCache = (key, data) => {
        dispatch({ type: 'SET_CACHE', key, payload: data });
    };

    // Get cache
    const getCache = (key) => {
        return state.cache[key];
    };

    // Clear cache
    const clearCache = () => {
        dispatch({ type: 'CLEAR_CACHE' });
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // Context value
    const value = {
        // State
        ...state,

        // Actions
        fetchGlobalStats,
        showNotification,
        removeNotification,
        clearNotifications,
        setTheme,
        toggleSidebar,
        addRecentActivity,
        updateAppSettings,
        setCache,
        getCache,
        clearCache,
        clearError
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};