import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import APIService from './services/APIService';

// Import Admin Components
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Dashboard from './components/Dashboard';
import StudentsManagement from './components/StudentsManagement';
import LecturersManagement from './components/LecturersManagement';
import CoursesManagement from './components/CoursesManagement';
import AssignmentsManagement from './components/AssignmentsManagement';
import QuizzesManagement from './components/QuizzesManagement';
import SubmissionReview from './components/SubmissionReview';
import AnnouncementsManagement from './components/AnnouncementsManagement';
import SystemSettings from './components/SystemSettings';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import StudentCourses from './components/student/StudentCourses';
import StudentAssignments from './components/student/StudentAssignments';
import StudentQuizzes from './components/student/StudentQuizzes';
import StudentSubmissions from './components/student/StudentSubmissions';
import StudentAnnouncements from './components/student/StudentAnnouncements';
import StudentMaterials from './components/student/StudentMaterials';
import StudentProfile from './components/student/StudentProfile';

import './App.css';

const api = new APIService();

const ROLE_CONFIG = {
  ADMIN: {
    icon: '👨‍💼',
    color: '#ef4444',
    title: 'Admin Dashboard',
    menu: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'students', label: 'Students', icon: '👨‍🎓' },
      { id: 'lecturers', label: 'Lecturers', icon: '🧑‍🏫' },
      { id: 'courses', label: 'Courses', icon: '📚' },
      { id: 'assignments', label: 'Assignments', icon: '📝' },
      { id: 'quizzes', label: 'Quizzes', icon: '🧪' },
      { id: 'submissions', label: 'Submissions', icon: '📤' },
      { id: 'announcements', label: 'Announcements', icon: '📢' },
      { id: 'settings', label: 'Settings', icon: '⚙️' }
    ]
  },
  STUDENT: {
    icon: '👨‍🎓',
    color: '#3b82f6',
    title: 'Student Portal',
    menu: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'courses', label: 'My Courses', icon: '📚' },
      { id: 'assignments', label: 'Assignments', icon: '📝' },
      { id: 'quizzes', label: 'Quizzes', icon: '🧪' },
      { id: 'submissions', label: 'My Submissions', icon: '📤' },
      { id: 'materials', label: 'Course Materials', icon: '📁' },
      { id: 'announcements', label: 'Announcements', icon: '📢' },
      { id: 'profile', label: 'My Profile', icon: '👤' }
    ]
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        api.token = token;
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setActiveTab('dashboard');
  };

  const role = user?.role?.toUpperCase();
  const roleCfg = role ? ROLE_CONFIG[role] : null;

  const renderActiveComponent = () => {
    if (!user || !roleCfg) return <div className="error-message">Role not recognized</div>;

    if (activeTab === 'dashboard') {
      if (role === 'ADMIN') return <Dashboard api={api} />;
      if (role === 'STUDENT') return <StudentDashboard api={api} user={user} />;
    }

    if (role === 'ADMIN') {
      switch (activeTab) {
        case 'students':
          return <StudentsManagement api={api} />;
        case 'lecturers':
          return <LecturersManagement api={api} />;
        case 'courses':
          return <CoursesManagement api={api} />;
        case 'assignments':
          return <AssignmentsManagement api={api} />;
        case 'quizzes':
          return <QuizzesManagement api={api} />;
        case 'submissions':
          return <SubmissionReview api={api} />;
        case 'announcements':
          return <AnnouncementsManagement api={api} />;
        case 'settings':
          return <SystemSettings api={api} />;
        default:
          return <div className="error-message">Page not found</div>;
      }
    }

    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'courses':
          return <StudentCourses api={api} user={user} />;
        case 'assignments':
          return <StudentAssignments api={api} user={user} />;
        case 'quizzes':
          return <StudentQuizzes api={api} user={user} />;
        case 'submissions':
          return <StudentSubmissions api={api} user={user} />;
        case 'materials':
          return <StudentMaterials api={api} user={user} />;
        case 'announcements':
          return <StudentAnnouncements api={api} user={user} />;
        case 'profile':
          return <StudentProfile api={api} user={user} />;
        default:
          return <div className="error-message">Page not found</div>;
      }
    }

    return <div className="error-message">Role not recognized</div>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading LMS Portal...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <AppProvider value={{ api }}>
        <Login onLogin={handleLogin} api={api} />
      </AppProvider>
    );
  }

  if (!roleCfg) {
    return (
      <div className="error-message">
        Unsupported role: {user.role}
      </div>
    );
  }

  return (
    <AppProvider value={{ api, user, activeTab, setActiveTab }}>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              {roleCfg.icon} LMS Portal
            </h2>
            <div
              className="user-role-badge"
              style={{ backgroundColor: roleCfg.color }}
            >
              {role}
            </div>
          </div>

          <nav className="sidebar-nav">
            {roleCfg.menu.map(item => (
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
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        <div className="main-content">
          <header className="header">
            <div className="header-left">
              <h1 className="header-title">{roleCfg.title}</h1>
            </div>
            <div className="header-right">
              <div className="user-info">
                <span className="welcome-text">Welcome, {user.fullName}</span>
                <div
                  className="role-badge"
                  style={{ backgroundColor: roleCfg.color }}
                >
                  {roleCfg.icon} {role}
                </div>
                <div className="user-avatar">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="logout-button">
                  🚪 Logout
                </button>
              </div>
            </div>
          </header>

          <div className="content">
            <div className="content-wrapper">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
