import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { submissionService } from '../../services/submissionService';
import { quizService } from '../../services/quizService';

const DashboardCharts = ({ stats }) => {
    const [submissionData, setSubmissionData] = useState([]);
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Mock data for demonstration - replace with actual API calls
                const mockSubmissionData = [
                    { month: 'Jan', submissions: 45 },
                    { month: 'Feb', submissions: 52 },
                    { month: 'Mar', submissions: 38 },
                    { month: 'Apr', submissions: 61 },
                    { month: 'May', submissions: 55 },
                    { month: 'Jun', submissions: 67 }
                ];

                const mockQuizData = [
                    { name: 'Completed', value: 65, color: '#10B981' },
                    { name: 'In Progress', value: 25, color: '#F59E0B' },
                    { name: 'Not Started', value: 10, color: '#EF4444' }
                ];

                setSubmissionData(mockSubmissionData);
                setQuizData(mockQuizData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    // Overview data for pie chart
    const overviewData = [
        { name: 'Students', value: stats.totalStudents, color: '#3B82F6' },
        { name: 'Lecturers', value: stats.totalLecturers, color: '#10B981' },
        { name: 'Courses', value: stats.totalCourses, color: '#8B5CF6' },
        { name: 'Submissions', value: stats.totalSubmissions, color: '#F59E0B' }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions Over Time */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Submissions</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={submissionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="submissions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* System Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={overviewData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {overviewData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {overviewData.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quiz Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={quizData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {quizData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 gap-2 mt-4">
                    {quizData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm text-gray-600">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div>
                            <p className="text-sm text-gray-900">New student registration</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div>
                            <p className="text-sm text-gray-900">Assignment submitted</p>
                            <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                        <div>
                            <p className="text-sm text-gray-900">New course created</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                        <div>
                            <p className="text-sm text-gray-900">Quiz completed</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;