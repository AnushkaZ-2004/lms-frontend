import { lazy } from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Dashboard = lazy(() => import('../pages/Admin/Dashboard'));
const ManageStudents = lazy(() => import('../pages/Admin/ManageStudents'));
const ManageLecturers = lazy(() => import('../pages/Admin/ManageLecturers'));
const ManageCourses = lazy(() => import('../pages/Admin/ManageCourses'));
const ManageAssignments = lazy(() => import('../pages/Admin/ManageAssignments'));
const ManageQuizzes = lazy(() => import('../pages/Admin/ManageQuizzes'));
const ManageSubmissions = lazy(() => import('../pages/Admin/ManageSubmissions'));
const ManageAnnouncements = lazy(() => import('../pages/Admin/ManageAnnouncements'));
const Settings = lazy(() => import('../pages/Admin/Settings'));

export const adminRoutes = [
    {
        path: 'dashboard',
        element: <Dashboard />
    },
    {
        path: 'students',
        element: <ManageStudents />
    },
    {
        path: 'lecturers',
        element: <ManageLecturers />
    },
    {
        path: 'courses',
        element: <ManageCourses />
    },
    {
        path: 'assignments',
        element: <ManageAssignments />
    },
    {
        path: 'quizzes',
        element: <ManageQuizzes />
    },
    {
        path: 'submissions',
        element: <ManageSubmissions />
    },
    {
        path: 'announcements',
        element: <ManageAnnouncements />
    },
    {
        path: 'settings',
        element: <Settings />
    }
];

export const getAdminRoutes = () => {
    return adminRoutes.map(route => ({
        ...route,
        element: <ProtectedRoute roles={['ADMIN']}>{route.element}</ProtectedRoute>
    }));
};