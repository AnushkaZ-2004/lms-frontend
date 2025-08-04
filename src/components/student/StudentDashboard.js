import React, { useState, useEffect } from 'react';

function StudentDashboard({ api, user }) {
    const [stats, setStats] = useState({
        enrolledCourses: 0,
        assignments: 0,
        completedAssignments: 0,
        quizzesTaken: 0,
        averageScore: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudentDashboard();
    }, []);

    const loadStudentDashboard = async () => {
        setLoading(true);
        try {
            const [courses, assignments, submissions, attempts] = await Promise.all([
                api.getCourses(),
                api.getAssignments(),
                api.getSubmissions(null, user.id),
                api.getAttemptsByStudent(user.id)
            ]);

            setStats({
                enrolledCourses: courses.length,
                assignments: assignments.length,
                completedAssignments: submissions.length,
                quizzesTaken: attempts.length,
                averageScore: attempts.length > 0
                    ? Math.round(attempts.reduce((sum, att) => sum + att.score, 0) / attempts.length)
                    : 0
            });

            // Get upcoming deadlines
            const upcoming = assignments
                .filter(assignment => new Date(assignment.dueDate) > new Date())
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5);
            setUpcomingDeadlines(upcoming);

            // Generate recent activity
            const activity = [
                ...submissions.slice(-3).map(sub => ({
                    type: 'submission',
                    message: `Submitted assignment`,
                    date: sub.submittedAt,
                    status: sub.marks ? 'graded' : 'pending'
                })),
                ...attempts.slice(-3).map(att => ({
                    type: 'quiz',
                    message: `Completed quiz - Score: ${att.score}%`,
                    date: new Date().toISOString(),
                    status: 'completed'
                }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

            setRecentActivity(activity);
        } catch (error) {
            console.error('Error loading student dashboard:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="loading">Loading your dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="welcome-section">
                <h1 className="welcome-title">Welcome back, {user.fullName}! 👨‍🎓</h1>
                <p className="welcome-subtitle">Here's your learning progress overview</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card students">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <h3 className="stat-value">{stats.enrolledCourses}</h3>
                        <p className="stat-label">Enrolled Courses</p>
                    </div>
                </div>

                <div className="stat-card lecturers">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                        <h3 className="stat-value">{stats.completedAssignments}/{stats.assignments}</h3>
                        <p className="stat-label">Assignments Completed</p>
                    </div>
                </div>

                <div className="stat-card courses">
                    <div className="stat-icon">🧪</div>
                    <div className="stat-info">
                        <h3 className="stat-value">{stats.quizzesTaken}</h3>
                        <p className="stat-label">Quizzes Taken</p>
                    </div>
                </div>

                <div className="stat-card submissions">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                        <h3 className="stat-value">{stats.averageScore}%</h3>
                        <p className="stat-label">Average Score</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3 className="card-title">📅 Upcoming Deadlines</h3>
                    <div className="card-content">
                        {upcomingDeadlines.length > 0 ? (
                            upcomingDeadlines.map(assignment => (
                                <div key={assignment.id} className="deadline-item">
                                    <div className="deadline-info">
                                        <h4 className="deadline-title">{assignment.title}</h4>
                                        <p className="deadline-date">
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="deadline-status">
                                        ⏰
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-message">No upcoming deadlines</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3 className="card-title">🔄 Recent Activity</h3>
                    <div className="card-content">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">
                                        {activity.type === 'submission' ? '📤' : '🧪'}
                                    </div>
                                    <div className="activity-info">
                                        <p className="activity-message">{activity.message}</p>
                                        <small className="activity-date">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <div className={`activity-status ${activity.status}`}>
                                        {activity.status}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-message">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;