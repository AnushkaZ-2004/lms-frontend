import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    FileText,
    ClipboardCheck,
    Send,
    Settings,
    HelpCircle
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Students', path: '/students' },
        { icon: GraduationCap, label: 'Lecturers', path: '/lecturers' },
        { icon: BookOpen, label: 'Courses', path: '/courses' },
        { icon: FileText, label: 'Assignments', path: '/assignments' },
        { icon: HelpCircle, label: 'Quizzes', path: '/quizzes' },
        { icon: ClipboardCheck, label: 'Submissions', path: '/submissions' },
        { icon: Send, label: 'Announcements', path: '/announcements' },
        { icon: Settings, label: 'Settings', path: '/settings' }
    ];

    return (
        <aside className="bg-white w-64 min-h-screen fixed left-0 top-16 border-r border-gray-200 z-30">
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;