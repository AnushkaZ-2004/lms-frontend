import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import APIService from './services/APIService';

// Import Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentsManagement from './components/StudentsManagement';
import LecturersManagement from './components/LecturersManagement';
import CoursesManagement from './components/CoursesManagement';
import AssignmentsManagement from './components/AssignmentsManagement';
import QuizzesManagement from './components/QuizzesManagement';
import SubmissionReview from './components/SubmissionReview';
import AnnouncementsManagement from './components/AnnouncementsManagement';
import SystemSettings from './components/SystemSettings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Initialize API Service
const api = new APIService();

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing login
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'ADMIN') {
        setUser(parsedUser);
        api.token = token;
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setActiveTab('dashboard');
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard api={api} />;
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
        return <SystemSettings />;
      default:
        return <Dashboard api={api} />;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} api={api} />;
  }

  return (
    <AppProvider value={{ user, api }}>
      <div className="app">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
        <div className="main-content">
          <Header user={user} />
          <main className="content">
            {renderActiveComponent()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;