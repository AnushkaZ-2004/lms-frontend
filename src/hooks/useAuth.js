import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

/**
 * Custom authentication hook
 * Provides authentication utilities and state management
 */
export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Check authentication status
    const checkAuthStatus = useCallback(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            const storedUser = authService.getCurrentUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
                setIsAuthenticated(true);
            } else {
                clearAuthState();
            }
        } catch (err) {
            console.error('Error checking auth status:', err);
            clearAuthState();
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear authentication state
    const clearAuthState = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        setError(null);
    }, []);

    // Login function
    const login = useCallback(async (email, password, rememberMe = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login(email, password);

            if (response.token && response.user) {
                // Store token and user data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Update state
                setToken(response.token);
                setUser(response.user);
                setIsAuthenticated(true);

                return { success: true, user: response.user };
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            setError(errorMessage);
            clearAuthState();
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [clearAuthState]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            setLoading(true);

            // Call logout service
            authService.logout();

            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('rememberMe');

            // Clear state
            clearAuthState();

            return { success: true };
        } catch (err) {
            console.error('Logout error:', err);
            // Still clear state even if logout call fails
            clearAuthState();
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [clearAuthState]);

    // Refresh token
    const refreshToken = useCallback(async () => {
        try {
            const currentToken = localStorage.getItem('authToken');
            if (!currentToken) {
                throw new Error('No token found');
            }

            // You can implement token refresh logic here
            // const response = await authService.refreshToken(currentToken);
            // For now, just validate current token

            return { success: true };
        } catch (err) {
            console.error('Token refresh failed:', err);
            clearAuthState();
            return { success: false, error: err.message };
        }
    }, [clearAuthState]);

    // Check if user has specific role
    const hasRole = useCallback((role) => {
        return user?.role === role;
    }, [user]);

    // Check if user has any of the specified roles
    const hasAnyRole = useCallback((roles) => {
        return roles.includes(user?.role);
    }, [user]);

    // Check if user is admin
    const isAdmin = useCallback(() => {
        return hasRole('ADMIN');
    }, [hasRole]);

    // Check if user is lecturer
    const isLecturer = useCallback(() => {
        return hasRole('LECTURER');
    }, [hasRole]);

    // Check if user is student
    const isStudent = useCallback(() => {
        return hasRole('STUDENT');
    }, [hasRole]);

    // Get user permissions based on role
    const getPermissions = useCallback(() => {
        if (!user) return [];

        switch (user.role) {
            case 'ADMIN':
                return [
                    'manage_users',
                    'manage_courses',
                    'manage_assignments',
                    'manage_quizzes',
                    'manage_submissions',
                    'manage_announcements',
                    'manage_settings',
                    'view_analytics'
                ];
            case 'LECTURER':
                return [
                    'manage_own_courses',
                    'manage_assignments',
                    'manage_quizzes',
                    'grade_submissions',
                    'manage_course_announcements',
                    'view_course_analytics'
                ];
            case 'STUDENT':
                return [
                    'view_courses',
                    'submit_assignments',
                    'take_quizzes',
                    'view_grades',
                    'view_announcements'
                ];
            default:
                return [];
        }
    }, [user]);

    // Check if user has specific permission
    const hasPermission = useCallback((permission) => {
        const permissions = getPermissions();
        return permissions.includes(permission);
    }, [getPermissions]);

    // Get user display name
    const getUserDisplayName = useCallback(() => {
        if (!user) return 'Guest';
        return user.fullName || user.name || user.email || 'User';
    }, [user]);

    // Get user avatar/initials
    const getUserInitials = useCallback(() => {
        if (!user) return '?';
        const name = getUserDisplayName();
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }, [user, getUserDisplayName]);

    // Check if token is expired (basic check)
    const isTokenExpired = useCallback(() => {
        if (!token) return true;

        try {
            // Basic JWT token expiry check
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (err) {
            console.error('Error checking token expiry:', err);
            return true;
        }
    }, [token]);

    // Auto logout on token expiry
    useEffect(() => {
        if (isAuthenticated && isTokenExpired()) {
            console.log('Token expired, logging out...');
            logout();
        }
    }, [isAuthenticated, isTokenExpired, logout]);

    return {
        // State
        isAuthenticated,
        user,
        token,
        loading,
        error,

        // Actions
        login,
        logout,
        refreshToken,
        checkAuthStatus,

        // Role checks
        hasRole,
        hasAnyRole,
        isAdmin,
        isLecturer,
        isStudent,

        // Permissions
        getPermissions,
        hasPermission,

        // Utilities
        getUserDisplayName,
        getUserInitials,
        isTokenExpired,
        clearAuthState
    };
};

// Hook for protected operations
export const useProtectedAction = () => {
    const { isAuthenticated, hasPermission } = useAuth();

    const executeWithPermission = useCallback(async (permission, action) => {
        if (!isAuthenticated) {
            throw new Error('User not authenticated');
        }

        if (!hasPermission(permission)) {
            throw new Error('Insufficient permissions');
        }

        return await action();
    }, [isAuthenticated, hasPermission]);

    return { executeWithPermission };
};

// Hook for role-based rendering
export const useRoleGuard = () => {
    const { hasRole, hasAnyRole, hasPermission } = useAuth();

    const RoleGuard = useCallback(({ roles, permissions, children, fallback = null }) => {
        const hasRequiredRole = roles ? hasAnyRole(roles) : true;
        const hasRequiredPermission = permissions ? permissions.every(p => hasPermission(p)) : true;

        if (hasRequiredRole && hasRequiredPermission) {
            return children;
        }

        return fallback;
    }, [hasAnyRole, hasPermission]);

    return { RoleGuard };
};

export default useAuth;