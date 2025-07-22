import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { studentService } from '../../services/studentService';
import StudentForm from '../../components/forms/StudentForm';
import Modal from '../../components/common/Modal';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const fetchStudents = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await studentService.getAllStudents(page, 10, search);
            setStudents(response.content || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents(0, searchTerm);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentService.deleteStudent(id);
                fetchStudents(currentPage, searchTerm);
            } catch (error) {
                console.error('Error deleting student:', error);
            }
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
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex space-x-4">
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
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                    Search
                </button>
            </form>

            {/* Students Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registration No
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.registrationNo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => fetchStudents(currentPage - 1, searchTerm)}
                                disabled={currentPage === 0}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchStudents(currentPage + 1, searchTerm)}
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
                                            onClick={() => fetchStudents(i, searchTerm)}
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
            </div>

            {/* Modal for Add/Edit Student */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                }}
                title={editingStudent ? 'Edit Student' : 'Add New Student'}
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
        </div>
    );
};

export default StudentList;