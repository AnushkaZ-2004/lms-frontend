import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, User, Calendar, FileText, Trophy } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { submissionService } from '../../services/submissionService';
import { quizService } from '../../services/quizService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import StudentForm from '../../components/forms/StudentForm';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const [studentData, submissionsData, attemptsData] = await Promise.all([
                    studentService.getStudentById(id),
                    submissionService.getSubmissionsByStudent(id),
                    quizService.getAttemptsByStudent(id)
                ]);

                setStudent(studentData);
                setSubmissions(submissionsData);
                setQuizAttempts(attemptsData);
            } catch (error) {
                console.error('Error fetching student data:', error);
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
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" text="Loading student details..." />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Student not found</p>
                <button
                    onClick={() => navigate('/students')}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg"
                >
                    Back to Students
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'quizzes', label: 'Quiz Results', icon: Trophy }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/students')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{student.fullName}</h1>
                        <p className="text-gray-600">{student.registrationNo}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit Student</span>
                </button>
            </div>

            {/* Student Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{student.fullName}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Mail className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{student.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Registration No</p>
                            <p className="font-medium">{student.registrationNo}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-900">Total Submissions</h3>
                                <p className="text-2xl font-bold text-blue-600">{submissions.length}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-900">Quiz Attempts</h3>
                                <p className="text-2xl font-bold text-green-600">{quizAttempts.length}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-900">Average Score</h3>
                                <p className="text-2xl font-bold text-purple-600">
                                    {quizAttempts.length > 0
                                        ? Math.round(quizAttempts.reduce((acc, attempt) => acc + attempt.score, 0) / quizAttempts.length)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div className="space-y-4">
                            {submissions.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No submissions found</p>
                            ) : (
                                submissions.map((submission) => (
                                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">Assignment #{submission.assignmentId}</h4>
                                                <p className="text-sm text-gray-600">{submission.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {submission.marks !== null ? (
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                        {submission.marks} marks
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {submission.feedback && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded">
                                                <p className="text-sm text-gray-700">Feedback: {submission.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'quizzes' && (
                        <div className="space-y-4">
                            {quizAttempts.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No quiz attempts found</p>
                            ) : (
                                quizAttempts.map((attempt) => (
                                    <div key={attempt.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">Quiz #{attempt.quizId}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {attempt.correctAnswers} out of {attempt.totalQuestions} correct
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${attempt.score >= 80 ? 'bg-green-100 text-green-800' :
                                                        attempt.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {attempt.score}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Student"
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