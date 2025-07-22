import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Layout from './components/common/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import StudentList from './pages/students/StudentList';
import LecturerList from './pages/lecturers/LecturerList';
import CourseList from './pages/courses/CourseList';
import AssignmentList from './pages/assignments/AssignmentList';
import QuizList from './pages/quizzes/QuizList';
import SubmissionReview from './pages/submissions/SubmissionReview';
import AnnouncementList from './pages/announcements/AnnouncementList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<StudentList />} />
              <Route path="lecturers" element={<LecturerList />} />
              <Route path="courses" element={<CourseList />} />
              <Route path="assignments" element={<AssignmentList />} />
              <Route path="quizzes" element={<QuizList />} />
              <Route path="submissions" element={<SubmissionReview />} />
              <Route path="announcements" element={<AnnouncementList />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;