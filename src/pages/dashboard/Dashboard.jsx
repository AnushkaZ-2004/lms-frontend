import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, FileText } from 'lucide-react';
import DashboardCharts from '../../components/charts/DashboardCharts';
// Comment out real services for now
// import { studentService } from '../../services/studentService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalLecturers: 0,
        totalCourses: 0,
        totalSubmissions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // TEMPORARY: Use mock data instead of real API calls
                const mockStats = {
                    totalStudents: 156,
                    totalLecturers: 23,
                    totalCourses: 45,
                    totalSubmissions: 89
                };

                setStats(mockStats);

                /* COMMENT OUT REAL API CALLS FOR NOW:
                const [students, lecturers, courses, submissions] = await Promise.all([
                  studentService.getAllStudents(0, 1),
                  lecturerService.getAllLecturers(0, 1),
                  courseService.getAllCourses(0, 1),
                  submissionService.getAllSubmissions(0, 1)
                ]);
        
                setStats({
                  totalStudents: students.totalElements || 0,
                  totalLecturers: lecturers.totalElements || 0,
                  totalCourses: courses.totalElements || 0,
                  totalSubmissions: submissions.totalElements || 0
                });
                */
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Rest of your component code stays the same...
    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: Users,
            bgColor: 'bg-blue-500',
            textColor: 'text-blue-600'
        },
        {
            title: 'Total Lecturers',
            value: stats.totalLecturers,
            icon: GraduationCap,
            bgColor: 'bg-green-500',
            textColor: 'text-green-600'
        },
        {
            title: 'Total Courses',
            value: stats.totalCourses,
            icon: BookOpen,
            bgColor: 'bg-purple-500',
            textColor: 'text-purple-600'
        },
        {
            title: 'Total Submissions',
            value: stats.totalSubmissions,
            icon: FileText,
            bgColor: 'bg-orange-500',
            textColor: 'text-orange-600'
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Welcome back! Here's what's happening in your LMS.
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <DashboardCharts stats={stats} />
        </div>
    );
};

export default Dashboard;