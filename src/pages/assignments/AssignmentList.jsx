import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { assignmentService } from '../../services/assignmentService';
import { courseService } from '../../services/courseService';
import AssignmentForm from '../../components/forms/AssignmentForm';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AssignmentList = () => {
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchAssignments = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await assignmentService.getAllAssignments(page, 10, search);
            setAssignments(response.content || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await courseService.getAllCourses(0, 100);
            setCourses(response.content || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchAssignments();
        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAssignments(0, searchTerm);
    };

    const handleEdit = (assignment) => {
        setEditingAssignment(assignment);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await assignmentService.deleteAssignment(id);
                fetchAssignments(currentPage, searchTerm);
            } catch (error) {
                console.error('Error deleting assignment:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingAssignment) {
                await assignmentService.updateAssignment(editingAssignment.id, formData);
            } else {
                await assignmentService.createAssignment(formData);
            }
            setShowModal(false);
            setEditingAssignment(null);
            fetchAssignments(currentPage, searchTerm);
        } catch (error) {
            console.error('Error saving assignment:', error);
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusColor = (dueDate) => {
        const daysUntilDue = getDaysUntilDue(dueDate);
        if (daysUntilDue < 0) return 'bg-red-100 text-red-800';
        if (daysUntilDue <= 3) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (dueDate) => {
        const daysUntilDue = getDaysUntilDue(dueDate);
        if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} day(s)`;
        if (daysUntilDue === 0) return 'Due today';
        if (daysUntilDue <= 3) return `Due in ${daysUntilDue} day(s)`;
        return `Due in ${daysUntilDue} day(s)`;
    };

    const filteredAssignments = assignments.filter(assignment => {
        if (filterStatus === 'all') return true;
        const daysUntilDue = getDaysUntilDue(assignment.dueDate);
        if (filterStatus === 'overdue') return daysUntilDue < 0;
        if (filterStatus === 'upcoming') return daysUntilDue >= 0;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Assignment</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
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

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    <option value="all">All Assignments</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>

            {/* Assignments List */}
            {loading ? (
                <LoadingSpinner size="lg" text="Loading assignments..." />
            ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new assignment.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assignment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAssignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">{assignment.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{getCourseName(assignment.courseId)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(assignment.dueDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(assignment.dueDate).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.dueDate)}`}>
                                                {getDaysUntilDue(assignment.dueDate) < 0 && <AlertTriangle className="w-3 h-3 mr-1" />}
                                                {getDaysUntilDue(assignment.dueDate) <= 3 && getDaysUntilDue(assignment.dueDate) >= 0 && <Clock className="w-3 h-3 mr-1" />}
                                                {getStatusText(assignment.dueDate)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(assignment)}
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(assignment.id)}
                                                    className="text-red-600 hover:text-red-900"
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => fetchAssignments(currentPage - 1, searchTerm)}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchAssignments(currentPage + 1, searchTerm)}
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
                                                onClick={() => fetchAssignments(i, searchTerm)}
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
            )}

            {/* Modal for Add/Edit Assignment */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingAssignment(null);
                }}
                title={editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
                size="lg"
            >
                <AssignmentForm
                    assignment={editingAssignment}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingAssignment(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default AssignmentList;