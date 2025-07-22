import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, BookOpen, User, FileText, HelpCircle, Users } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { lecturerService } from '../../services/lecturerService';
import { assignmentService } from '../../services/assignmentService';
import { quizService } from '../../services/quizService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import CourseForm from '../../components/forms/CourseForm';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lecturer, setLecturer] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const courseData = await courseService.getCourseById(id);
                setCourse(courseData);

                const [lecturerData, assignmentsData, quizzesData] = await Promise.all([
                    lecturerService.getLecturerById(courseData.lecturerId),
                    assignmentService.getAssignmentsByCourse(id),
                    quizService.getQuizzesByCourse(id)
                ]);

                setLecturer(lecturerData);
                setAssignments(assignmentsData);
                setQuizzes(quizzesData);
            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourseData();
        }
    }, [id]);

    const handleUpdateCourse = async (formData) => {
        try {
            const updatedCourse = await courseService.updateCourse(id, formData);
            setCourse(updatedCourse);

            // Fetch updated lecturer if changed
            if (formData.lecturerId !== lecturer?.id) {
                const newLecturer = await lecturerService.getLecturerById(formData.lecturerId);
                setLecturer(newLecturer);
            }

            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" text="Loading course details..." />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Course not found</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg"
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'assignments', label: 'Assignments', icon: FileText },
        { id: 'quizzes', label: 'Quizzes', icon: HelpCircle }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/courses')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                        <p className="text-gray-600">{course.code}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit Course</span>
                </button>
            </div>

            {/* Course Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Course Code</p>
                            <p className="font-medium">{course.code}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-3 rounded-full">
                            <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Lecturer</p>
                            <p className="font-medium">{lecturer?.fullName || 'Unknown'}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Assignments</p>
                            <p className="font-medium">{assignments.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-3 rounded-full">
                            <HelpCircle className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Quizzes</p>
                            <p className="font-medium">{quizzes.length}</p>
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
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Description</h3>
                                <p className="text-gray-700">{course.description}</p>
                            </div>

                            {lecturer && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lecturer Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-primary-100 p-3 rounded-full">
                                                <User className="w-8 h-8 text-primary-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{lecturer.fullName}</h4>
                                                <p className="text-sm text-gray-600">{lecturer.email}</p>
                                                <p className="text-sm text-gray-500">{lecturer.department}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">Course Statistics</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-blue-800">Total Assignments:</span>
                                            <span className="font-medium text-blue-900">{assignments.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-800">Total Quizzes:</span>
                                            <span className="font-medium text-blue-900">{quizzes.length}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-900 mb-2">Quick Actions</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => navigate('/assignments')}
                                            className="w-full text-left text-green-800 hover:text-green-900"
                                        >
                                            → View All Assignments
                                        </button>
                                        <button
                                            onClick={() => navigate('/quizzes')}
                                            className="w-full text-left text-green-800 hover:text-green-900"
                                        >
                                            → View All Quizzes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div className="space-y-4">
                            {assignments.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
                                    <p className="mt-1 text-sm text-gray-500">This course doesn't have any assignments yet.</p>
                                </div>
                            ) : (
                                assignments.map((assignment) => (
                                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                {new Date(assignment.dueDate) < new Date() ? (
                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                                        Overdue
                                                    </span>
                                                ) : (
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'quizzes' && (
                        <div className="space-y-4">
                            {quizzes.length === 0 ? (
                                <div className="text-center py-8">
                                    <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes</h3>
                                    <p className="mt-1 text-sm text-gray-500">This course doesn't have any quizzes yet.</p>
                                </div>
                            ) : (
                                quizzes.map((quiz) => (
                                    <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">Course: {course.title}</p>
                                            </div>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                Quiz
                                            </span>
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
                title="Edit Course"
                size="lg"
            >
                <CourseForm
                    course={course}
                    onSubmit={handleUpdateCourse}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>
        </div>
    );
};

export default CourseDetails;