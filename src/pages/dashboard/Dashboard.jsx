import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, FileText } from 'lucide-react';
import DashboardCharts from '../../components/charts/DashboardCharts';
import { studentService } from '../../services/studentService'; // Enable real student service

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

                // Get REAL student count from your student service
                let studentCount = 0;
                try {
                    const studentsResponse = await studentService.getAllStudents(0, 1);
                    studentCount = studentsResponse.totalElements || 0;
                    console.log('Real student count:', studentCount);
                } catch (error) {
                    console.error('Student service error:', error);
                    studentCount = 0; // Fallback if service is down
                }

                // Use real student data + mock data for other services
                setStats({
                    totalStudents: studentCount,        // REAL DATA from student service
                    totalLecturers: 23,                // Mock until lecturer service ready
                    totalCourses: 45,                  // Mock until course service ready
                    totalSubmissions: 89               // Mock until submission service ready
                });

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                // Fallback to all mock data if everything fails
                setStats({
                    totalStudents: 0,
                    totalLecturers: 23,
                    totalCourses: 45,
                    totalSubmissions: 89
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: Users,
            bgColor: 'bg-blue-500',
            textColor: 'text-blue-600',
            isReal: true // Indicator for real data
        },
        {
            title: 'Total Lecturers',
            value: stats.totalLecturers,
            icon: GraduationCap,
            bgColor: 'bg-green-500',
            textColor: 'text-green-600',
            isReal: false // Mock data
        },
        {
            title: 'Total Courses',
            value: stats.totalCourses,
            icon: BookOpen,
            bgColor: 'bg-purple-500',
            textColor: 'text-purple-600',
            isReal: false // Mock data
        },
        {
            title: 'Total Submissions',
            value: stats.totalSubmissions,
            icon: FileText,
            bgColor: 'bg-orange-500',
            textColor: 'text-orange-600',
            isReal: false // Mock data
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="ml-3 text-gray-600">Loading dashboard...</p>
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
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 relative">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        {/* Show indicator for real vs mock data */}
                        <div className="absolute top-2 right-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${stat.isReal ? 'bg-green-400' : 'bg-yellow-400'
                                }`} title={stat.isReal ? 'Real data' : 'Mock data'}></span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Service Status Indicator */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">Student Service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">Lecturer Service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">Course Service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-500">Submission Service</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <DashboardCharts stats={stats} />
        </div>
    );
};

export default Dashboard;