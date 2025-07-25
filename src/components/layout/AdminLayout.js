import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import './AdminLayout.css';

function AdminLayout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const navItems = [
        { path: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
        { path: '/admin/students', icon: '👨‍🎓', label: 'Students' },
        { path: '/admin/lecturers', icon: '🧑‍🏫', label: 'Lecturers' },
        { path: '/admin/courses', icon: '📚', label: 'Courses' },
        { path: '/admin/assignments', icon: '📝', label: 'Assignments' },
        { path: '/admin/quizzes', icon: '🧪', label: 'Quizzes' },
        { path: '/admin/submissions', icon: '📤', label: 'Submissions' },
        { path: '/admin/announcements', icon: '📨', label: 'Announcements' },
        { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <div className="admin-layout">
            <Sidebar items={navItems} />
            <div className="main-content">
                <Header />
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;