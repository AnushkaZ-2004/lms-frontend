import React, { useState, useEffect } from 'react';
import DashboardCard from '../../components/ui/DashboardCard';
import StudentService from '../../services/StudentService';
import LecturerService from '../../services/LecturerService';
import CourseService from '../../services/CourseService';
import SubmissionService from '../../services/SubmissionService';
import { Bar, Pie } from 'react-chartjs-2';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({
        students: 0,
        lecturers: 0,
        courses: 0,
        submissions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, lecturersRes, coursesRes, submissionsRes] = await Promise.all([
                    StudentService.getStudents(),
                    LecturerService.getLecturers(),
                    CourseService.getCourses(),
                    SubmissionService.getSubmissions(),
                ]);

                setStats({
                    students: studentsRes.data.length,
                    lecturers: lecturersRes.data.length,
                    courses: coursesRes.data.length,
                    submissions: submissionsRes.data.length,
                });

                // Prepare chart data
                setChartData({
                    bar: {
                        labels: ['Students', 'Lecturers', 'Courses', 'Submissions'],
                        datasets: [
                            {
                                label: 'System Statistics',
                                data: [
                                    studentsRes.data.length,
                                    lecturersRes.data.length,
                                    coursesRes.data.length,
                                    submissionsRes.data.length,
                                ],
                                backgroundColor: [
                                    '#4CAF50',
                                    '#2196F3',
                                    '#FF9800',
                                    '#9C27B0',
                                ],
                            },
                        ],
                    },
                    pie: {
                        labels: ['Students', 'Lecturers'],
                        datasets: [
                            {
                                data: [studentsRes.data.length, lecturersRes.data.length],
                                backgroundColor: ['#4CAF50', '#2196F3'],
                            },
                        ],
                    },
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="dashboard">
            <h1>Dashboard Overview</h1>

            <div className="dashboard-cards">
                <DashboardCard
                    title="Total Students"
                    value={stats.students}
                    icon="👨‍🎓"
                    color="#4CAF50"
                />
                <DashboardCard
                    title="Total Lecturers"
                    value={stats.lecturers}
                    icon="🧑‍🏫"
                    color="#2196F3"
                />
                <DashboardCard
                    title="Total Courses"
                    value={stats.courses}
                    icon="📚"
                    color="#FF9800"
                />
                <DashboardCard
                    title="Submissions"
                    value={stats.submissions}
                    icon="📤"
                    color="#9C27B0"
                />
            </div>

            <div className="dashboard-charts">
                {chartData && (
                    <>
                        <div className="chart-container">
                            <h2>System Statistics</h2>
                            <Bar
                                data={chartData.bar}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>

                        <div className="chart-container">
                            <h2>User Distribution</h2>
                            <Pie
                                data={chartData.pie}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;