import React from 'react';

function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '' },
        { id: 'students', label: 'Students', icon: '' },
        { id: 'lecturers', label: 'Lecturers', icon: '' },
        { id: 'courses', label: 'Courses', icon: '' },
        { id: 'assignments', label: 'Assignments', icon: '' },
        { id: 'quizzes', label: 'Quizzes', icon: '' },
        { id: 'submissions', label: 'Submissions', icon: '' },
        { id: 'announcements', label: 'Announcements', icon: '' },
        { id: 'settings', label: 'Settings', icon: '' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>LMS Admin</h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    <span>🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;