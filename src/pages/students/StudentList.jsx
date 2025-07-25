import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Users, Mail, IdCard, AlertCircle } from 'lucide-react';
import { studentService } from '../../services/studentService';
import StudentForm from '../../components/forms/StudentForm';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, student: null });
    const [error, setError] = useState(null);

    const fetchStudents = async (page = 0, search = '') => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentService.getAllStudents(page, 10, search);

            setStudents(response.content || []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to load students. Please check if the student service is running.');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchStudents(0, searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(0);
        fetchStudents(0, '');
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowModal(true);
    };

    const handleDelete = (student) => {
        setDeleteConfirm({ show: true, student });
    };

    const confirmDelete = async () => {
        try {
            await studentService.deleteStudent(deleteConfirm.student.id);
            setDeleteConfirm({ show: false, student: null });

            // Refresh the current page, or go to previous page if current page becomes empty
            const newTotalElements = totalElements - 1;
            const newTotalPages = Math.ceil(newTotalElements / 10);
            const pageToFetch = currentPage >= newTotalPages ? Math.max(0, newTotalPages - 1) : currentPage;

            fetchStudents(pageToFetch, searchTerm);
        } catch (error) {
            console.error('Error deleting student:', error);
            setError('Failed to delete student. Please try again.');
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingStudent) {
                await studentService.updateStudent(editingStudent.id, formData);
            } else {
                await studentService.createStudent(formData);
            }
            setShowModal(false);
            setEditingStudent(null);
            fetchStudents(currentPage, searchTerm);
        } catch (error) {
            console.error('Error saving student:', error);
            throw error; // Re-throw to let the form handle the error
        }
    };

    const handlePageChange = (newPage) => {
        fetchStudents(newPage, searchTerm);
    };

    const StudentCard = ({ student }) => (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 p-3 rounded-full">
                        <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
                        <p className="text-sm text-gray-500">ID: {student.id}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <IdCard className="w-4 h-4" />
                    <span>{student.registrationNo}</span>
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                    onClick={() => handleEdit(student)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit Student"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleDelete(student)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Student"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first student.'}
            </p>
            {searchTerm && (
                <button
                    onClick={handleClearSearch}
                    className="mt-3 text-primary-600 hover:text-primary-500 text-sm"
                >
                    Clear search
                </button>
            )}
        </div>
    );

    const ErrorState = () => (
        <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Students</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
                onClick={() => fetchStudents(currentPage, searchTerm)}
                className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                    <p className="text-gray-600">Manage student registrations and information</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Search and Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearch} className="flex-1 flex space-x-4 max-w-md">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Search
                        </button>
                    </form>

                    <div className="text-sm text-gray-600">
                        {totalElements > 0 && (
                            <span>
                                Showing {students.length} of {totalElements} students
                                {searchTerm && ` for "${searchTerm}"`}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingSpinner size="lg" text="Loading students..." />
            ) : error ? (
                <ErrorState />
            ) : students.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    {/* Students Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.map((student) => (
                            <StudentCard key={student.id} student={student} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-sm">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
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
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i;
                                            } else if (currentPage < 3) {
                                                pageNum = i;
                                            } else if (currentPage > totalPages - 4) {
                                                pageNum = totalPages - 5 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === currentPage
                                                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                }}
                title={editingStudent ? 'Edit Student' : 'Add New Student'}
                size="md"
            >
                <StudentForm
                    student={editingStudent}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingStudent(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, student: null })}
                title="Delete Student"
                size="sm"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Student</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete <strong>{deleteConfirm.student?.fullName}</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={() => setDeleteConfirm({ show: false, student: null })}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StudentList;