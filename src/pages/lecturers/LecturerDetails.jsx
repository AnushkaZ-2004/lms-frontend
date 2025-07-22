import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, User, Building, BookOpen } from 'lucide-react';
import { lecturerService } from '../../services/lecturerService';
import { courseService } from '../../services/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import LecturerForm from '../../components/forms/LecturerForm';

const LecturerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lecturer, setLecturer] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchLecturerData = async () => {
            try {
                setLoading(true);
                const [lecturerData, coursesData] = await Promise.all([
                    lecturerService.getLecturerById(id),
                    courseService.getCoursesByLecturer(id)
                ]);

                setLecturer(lecturerData);
                setCourses(coursesData);
            } catch (error) {
                console.error('Error fetching lecturer data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchLecturerData();
        }
    }, [id]);

    const handleUpdateLecturer = async (formData) => {
        try {
            const updatedLecturer = await lecturerService.updateLecturer(id, formData);
            setLecturer(updatedLecturer);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating lecturer:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" text="Loading lecturer details..." />
            </div>
        );
    }

    if (!lecturer) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Lecturer not found</p>
                <button
                    onClick={() => navigate('/lecturers')}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg"
                >
                    Back to Lecturers
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
                        onClick={() => navigate('/lecturers')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{lecturer.fullName}</h1>
                        <p className="text-gray-600">{lecturer.department}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Edit className="w-4 h-4" />
                    <span>Edit Lecturer</span>
                </button>
            </div>

            {/* Lecturer Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{lecturer.fullName}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Mail className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{lecturer.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Building className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{lecturer.department}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Assigned Courses</span>
                    </h2>
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {courses.length} courses
                    </span>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-8">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No courses assigned</h3>
                        <p className="mt-1 text-sm text-gray-500">This lecturer hasn't been assigned to any courses yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{course.code}</p>
                                        <p className="text-sm text-gray-700">{course.description}</p>
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                        {course.code}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-3 rounded-full">
                            <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="text-lg font-semibold text-gray-900">{lecturer.department}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Mail className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="text-sm font-medium text-gray-900 break-all">{lecturer.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Lecturer"
            >
                <LecturerForm
                    lecturer={lecturer}
                    onSubmit={handleUpdateLecturer}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>
        </div>
    );
};

export default LecturerDetails;