import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Layout from './components/common/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import StudentList from './pages/students/StudentList';
import StudentDetails from './pages/students/StudentDetails';
import LecturerList from './pages/lecturers/LecturerList';
import LecturerDetails from './pages/lecturers/LecturerDetails';
import CourseList from './pages/courses/CourseList';
import CourseDetails from './pages/courses/CourseDetails';
import AssignmentList from './pages/assignments/AssignmentList';
import QuizList from './pages/quizzes/QuizList';
import SubmissionReview from './pages/submissions/SubmissionReview';
import AnnouncementList from './pages/announcements/AnnouncementList';
import SystemSettings from './pages/settings/SystemSettings';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Student Management */}
                <Route path="students" element={<StudentList />} />
                <Route path="students/:id" element={<StudentDetails />} />

                {/* Lecturer Management */}
                <Route path="lecturers" element={<LecturerList />} />
                <Route path="lecturers/:id" element={<LecturerDetails />} />

                {/* Course Management */}
                <Route path="courses" element={<CourseList />} />
                <Route path="courses/:id" element={<CourseDetails />} />

                {/* Assignment Management */}
                <Route path="assignments" element={<AssignmentList />} />

                {/* Quiz Management */}
                <Route path="quizzes" element={<QuizList />} />

                {/* Submission Review */}
                <Route path="submissions" element={<SubmissionReview />} />

                {/* Announcements */}
                <Route path="announcements" element={<AnnouncementList />} />

                {/* System Settings */}
                <Route path="settings" element={<SystemSettings />} />

                {/* 404 Page */}
                <Route path="*" element={
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                    <button
                      onClick={() => window.history.back()}
                      className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg"
                    >
                      Go Back
                    </button>
                  </div>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;