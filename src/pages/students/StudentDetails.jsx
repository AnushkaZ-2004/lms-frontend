import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, User, Calendar, FileText, Trophy, AlertCircle } from 'lucide-react';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import StudentForm from '../../components/forms/StudentForm';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                setError(null);
                const studentData = await studentService.getStudentById(id);
                setStudent(studentData);
            } catch (error) {
                console.error('Error fetching student data:', error);
                setError('Failed to load student details. The student may not exist or the service may be unavailable.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudentData();
        }
    }, [id]);

    const handleUpdateStudent = async (formData) => {
        try {
            const updatedStudent = await studentService.updateStudent(id, formData);
            setStudent(updatedStudent);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating student:', error);
            throw error; // Re-throw to let the form handle the error
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" text="Loading student details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Student</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <div className="mt-6 space-x-3">
                    <button
                        onClick={() => navigate('/students')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Back to Students
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Student Not Found</h3>
                <p className="mt-1 text-sm text-gray-500">The student you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/students')}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                    Back to Students
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/students')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{student.fullName}</h1>
                        <p className="text-gray-600">Student Details</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit Student</span>
                </button>
            </div>

            {/* Student Info Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Full Name</p>
                            <p className="text-xl font-semibold text-gray-900">{student.fullName}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-4 rounded-full">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="text-xl font-semibold text-gray-900">{student.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 p-4 rounded-full">
                            <Calendar className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                            <p className="text-xl font-semibold text-gray-900">{student.registrationNo}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Submissions</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-xs text-gray-400">No submissions yet</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Trophy className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Quiz Attempts</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-xs text-gray-400">No quizzes taken</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Average Score</p>
                            <p className="text-2xl font-bold text-gray-900">-</p>
                            <p className="text-xs text-gray-400">Not available</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h4 className="mt-2 text-sm font-medium text-gray-900">No Recent Activity</h4>
                    <p className="mt-1 text-sm text-gray-500">
                        This student hasn't submitted any assignments or taken any quizzes yet.
                    </p>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Student"
                size="md"
            >
                <StudentForm
                    student={student}
                    onSubmit={handleUpdateStudent}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>
        </div>
    );
};

export default StudentDetails;