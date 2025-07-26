import React, { useState, useEffect } from 'react';

function Dashboard({ api }) {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalLecturers: 0,
        totalCourses: 0,
        totalSubmissions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await api.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome to LMS Admin Portal</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card students">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-info">
                        <h3>{stats.totalStudents}</h3>
                        <p>Total Students</p>
                    </div>
                </div>

                <div className="stat-card lecturers">
                    <div className="stat-icon">🧑‍🏫</div>
                    <div className="stat-info">
                        <h3>{stats.totalLecturers}</h3>
                        <p>Total Lecturers</p>
                    </div>
                </div>

                <div className="stat-card courses">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <h3>{stats.totalCourses}</h3>
                        <p>Total Courses</p>
                    </div>
                </div>

                <div className="stat-card submissions">
                    <div className="stat-icon">📤</div>
                    <div className="stat-info">
                        <h3>{stats.totalSubmissions}</h3>
                        <p>Total Submissions</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="chart-container">
                    <h3>Recent Activity</h3>
                    <div className="activity-chart">
                        <div className="chart-placeholder">
                            <p>Activity chart will be displayed here</p>
                            <div className="simple-chart">
                                <div className="chart-bar" style={{ height: '60%' }}></div>
                                <div className="chart-bar" style={{ height: '80%' }}></div>
                                <div className="chart-bar" style={{ height: '45%' }}></div>
                                <div className="chart-bar" style={{ height: '90%' }}></div>
                                <div className="chart-bar" style={{ height: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;