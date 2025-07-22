import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, GraduationCap } from 'lucide-react';
import { lecturerService } from '../../services/lecturerService';
import LecturerForm from '../../components/forms/LecturerForm';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LecturerList = () => {
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);

    const fetchLecturers = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await lecturerService.getAllLecturers(page, 10, search);
            setLecturers(response.content || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecturers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLecturers(0, searchTerm);
    };

    const handleEdit = (lecturer) => {
        setEditingLecturer(lecturer);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lecturer?')) {
            try {
                await lecturerService.deleteLecturer(id);
                fetchLecturers(currentPage, searchTerm);
            } catch (error) {
                console.error('Error deleting lecturer:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingLecturer) {
                await lecturerService.updateLecturer(editingLecturer.id, formData);
            } else {
                await lecturerService.createLecturer(formData);
            }
            setShowModal(false);
            setEditingLecturer(null);
            fetchLecturers(currentPage, searchTerm);
        } catch (error) {
            console.error('Error saving lecturer:', error);
        }
    };

    const getDepartmentColor = (department) => {
        const colors = {
            'Computer Science': 'bg-blue-100 text-blue-800',
            'Mathematics': 'bg-green-100 text-green-800',
            'Physics': 'bg-purple-100 text-purple-800',
            'Chemistry': 'bg-yellow-100 text-yellow-800',
            'Biology': 'bg-red-100 text-red-800',
        };
        return colors[department] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Lecturers</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Lecturer</span>
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search lecturers..."
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

            {/* Lecturers Grid */}
            {loading ? (
                <LoadingSpinner size="lg" text="Loading lecturers..." />
            ) : lecturers.length === 0 ? (
                <div className="text-center py-12">
                    <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No lecturers found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new lecturer.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lecturers.map((lecturer) => (
                        <div key={lecturer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="bg-primary-100 p-2 rounded-full">
                                            <GraduationCap className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{lecturer.fullName}</h3>
                                            <p className="text-sm text-gray-600">{lecturer.email}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(lecturer.department)}`}>
                                            {lecturer.department}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(lecturer)}
                                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(lecturer.id)}
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
                            onClick={() => fetchLecturers(currentPage - 1, searchTerm)}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => fetchLecturers(currentPage + 1, searchTerm)}
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
                                        onClick={() => fetchLecturers(i, searchTerm)}
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

            {/* Modal for Add/Edit Lecturer */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingLecturer(null);
                }}
                title={editingLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
            >
                <LecturerForm
                    lecturer={editingLecturer}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingLecturer(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default LecturerList;