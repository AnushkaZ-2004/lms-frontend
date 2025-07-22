import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, BookOpen, User } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { lecturerService } from '../../services/lecturerService';
import CourseForm from '../../components/forms/CourseForm';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const fetchCourses = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await courseService.getAllCourses(page, 10, search);
            setCourses(response.content || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLecturers = async () => {
        try {
            const response = await lecturerService.getAllLecturers(0, 100);
            setLecturers(response.content || []);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchLecturers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses(0, searchTerm);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseService.deleteCourse(id);
                fetchCourses(currentPage, searchTerm);
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingCourse) {
                await courseService.updateCourse(editingCourse.id, formData);
            } else {
                await courseService.createCourse(formData);
            }
            setShowModal(false);
            setEditingCourse(null);
            fetchCourses(currentPage, searchTerm);
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    const getLecturerName = (lecturerId) => {
        const lecturer = lecturers.find(l => l.id === lecturerId);
        return lecturer ? lecturer.fullName : 'Unknown';
    };

    const getLecturerDepartment = (lecturerId) => {
        const lecturer = lecturers.find(l => l.id === lecturerId);
        return lecturer ? lecturer.department : '';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Course</span>
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                    Search
                </button>
            </form>

            {/* Courses Grid */}
            {loading ? (
                <LoadingSpinner size="lg" text="Loading courses..." />
            ) : courses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new course.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-primary-100 p-2 rounded-full">
                                        <BookOpen className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                        <p className="text-sm text-gray-600">{course.code}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-700 mb-4 line-clamp-3">{course.description}</p>

                            <div className="flex items-center space-x-2 mb-4">
                                <User className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{getLecturerName(course.lecturerId)}</p>
                                    <p className="text-xs text-gray-500">{getLecturerDepartment(course.lecturerId)}</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(course)}
                                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(course.id)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => fetchCourses(currentPage - 1, searchTerm)}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => fetchCourses(currentPage + 1, searchTerm)}
                            disabled={currentPage >= totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => fetchCourses(i, searchTerm)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === currentPage
                                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            } ${i === 0 ? 'rounded-l-md' : ''} ${i === totalPages - 1 ? 'rounded-r-md' : ''
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Add/Edit Course */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingCourse(null);
                }}
                title={editingCourse ? 'Edit Course' : 'Add New Course'}
                size="lg"
            >
                <CourseForm
                    course={editingCourse}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingCourse(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default CourseList;