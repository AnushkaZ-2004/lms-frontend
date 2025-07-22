import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, AlertCircle, Mail, User, GraduationCap, X, RefreshCw } from 'lucide-react';
import { studentService } from '../../services/studentService';
import StudentForm from '../../components/forms/StudentForm';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('table');

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 Fetching students...');

            const response = await studentService.getAllStudents(0, 100, '');
            console.log('📥 API response:', response);

            let studentsData = [];

            if (response && typeof response === 'object') {
                if (Array.isArray(response)) {
                    studentsData = response;
                } else if (response.content && Array.isArray(response.content)) {
                    studentsData = response.content;
                } else {
                    studentsData = [];
                }
            }

            console.log('✅ Students loaded:', studentsData.length);

            setStudents(studentsData);
            setFilteredStudents(studentsData);
            setTotalElements(studentsData.length);
            setTotalPages(Math.ceil(studentsData.length / 10));

        } catch (error) {
            console.error('❌ Error fetching students:', error);
            setError(`Failed to fetch students: ${error.message}`);
            setStudents([]);
            setFilteredStudents([]);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handle search filtering on frontend
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student =>
                student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is handled by useEffect above
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            try {
                await studentService.deleteStudent(id);
                await fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student: ' + error.message);
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
            await fetchStudents();
        } catch (error) {
            console.error('Error saving student:', error);
            throw error;
        }
    };

    const StudentCard = ({ student }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {student.fullName}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <Mail className="w-4 h-4 mr-1" />
                                <span>{student.email}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <GraduationCap className="w-3 h-3 mr-1" />
                                    {student.registrationNo}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Student"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Student"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header - Always Visible */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Students Management</h1>
                            <p className="text-gray-600">
                                {error ? 'Manage your students (Connection issues detected)' :
                                    totalElements > 0
                                        ? `${filteredStudents.length} of ${totalElements} students${searchTerm ? ` matching "${searchTerm}"` : ''}`
                                        : 'Add and manage student information'
                                }
                            </p>
                        </div>

                        {/* Admin Controls - Always Visible */}
                        <div className="flex items-center space-x-4">
                            {/* Refresh Button */}
                            <button
                                onClick={fetchStudents}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Refresh Students List"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>

                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'cards'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'table'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Table
                                </button>
                            </div>

                            {/* Add Student Button - Always Visible for Admin */}
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Student</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-800">Service Connection Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                                <div className="mt-3 flex items-center space-x-3">
                                    <button
                                        onClick={fetchStudents}
                                        className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <p className="text-xs text-red-600">
                                        Note: You can still add students even with connection issues
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <form onSubmit={handleSearch} className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search students by name, email, or registration number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                        >
                            Search
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    {searchTerm && (
                        <div className="mt-3 text-sm text-gray-600">
                            {filteredStudents.length > 0
                                ? `Found ${filteredStudents.length} student${filteredStudents.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                                : `No students found matching "${searchTerm}"`
                            }
                        </div>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Loading students...</p>
                    </div>
                ) : filteredStudents.length === 0 && !error ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm ? 'No students found' : 'No students yet'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm ?
                                `No students match "${searchTerm}". Try a different search term.` :
                                'Get started by adding your first student to the system.'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                            >
                                Add Your First Student
                            </button>
                        )}
                    </div>
                ) : error && filteredStudents.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load students</h3>
                        <p className="text-gray-500 mb-6">
                            There seems to be a connection issue with the student service.
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={fetchStudents}
                                className="bg-red-100 hover:bg-red-200 text-red-800 px-6 py-3 rounded-lg transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                            >
                                Add New Student
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Results Info */}
                        <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {filteredStudents.length} of {totalElements} students
                                </div>
                                <div className="text-sm text-gray-500">
                                    Total registered: {totalElements}
                                </div>
                            </div>
                        </div>

                        {/* Cards View */}
                        {viewMode === 'cards' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStudents.map((student) => (
                                    <StudentCard key={student.id} student={student} />
                                ))}
                            </div>
                        ) : (
                            /* Table View */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                                                    Registration
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredStudents.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                                                                <User className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {student.fullName}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {student.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{student.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {student.registrationNo}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(student)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                                                title="Edit Student"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(student.id)}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                                                title="Delete Student"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Add Student Button - Fixed Position for Small Screens */}
                <div className="lg:hidden fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                        title="Add New Student"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Modal for Add/Edit Student */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                }}
                title={editingStudent ? 'Edit Student Information' : 'Add New Student'}
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
        </div>
    );
};

export default StudentList;