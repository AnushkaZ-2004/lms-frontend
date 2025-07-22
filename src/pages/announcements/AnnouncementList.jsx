import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Send, Globe, BookOpen, Calendar } from 'lucide-react';
import { announcementService } from '../../services/announcementService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AnnouncementList = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [filterType, setFilterType] = useState('all');

    const fetchAnnouncements = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await announcementService.getAllAnnouncements(page, 10, search);
            setAnnouncements(response.content || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching announcements:', error);
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
        fetchAnnouncements();
        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAnnouncements(0, searchTerm);
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await announcementService.deleteAnnouncement(id);
                fetchAnnouncements(currentPage, searchTerm);
            } catch (error) {
                console.error('Error deleting announcement:', error);
            }
        }
    };

    const AnnouncementForm = ({ announcement, onSubmit, onCancel }) => {
        const [formData, setFormData] = useState({
            title: announcement?.title || '',
            message: announcement?.message || '',
            courseId: announcement?.courseId || '',
            postedByRole: announcement?.postedByRole || user?.role || 'ADMIN',
            postedById: announcement?.postedById || user?.id
        });
        const [errors, setErrors] = useState({});

        const validateForm = () => {
            const newErrors = {};
            if (!formData.title.trim()) newErrors.title = 'Title is required';
            if (!formData.message.trim()) newErrors.message = 'Message is required';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            try {
                const submitData = {
                    ...formData,
                    courseId: formData.courseId ? parseInt(formData.courseId) : null,
                    postedById: parseInt(formData.postedById)
                };
                await onSubmit(submitData);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter announcement title"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        value={formData.courseId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Global Announcement</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.code} - {course.title}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Leave empty for global announcements or select a course for course-specific announcements
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={5}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.message ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter announcement message"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center space-x-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>Publish Announcement</span>
                    </button>
                </div>
            </form>
        );
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingAnnouncement) {
                await announcementService.updateAnnouncement(editingAnnouncement.id, formData);
            } else {
                await announcementService.createAnnouncement(formData);
            }
            setShowModal(false);
            setEditingAnnouncement(null);
            fetchAnnouncements(currentPage, searchTerm);
        } catch (error) {
            console.error('Error saving announcement:', error);
        }
    };

    const getCourseName = (courseId) => {
        if (!courseId) return 'Global';
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const filteredAnnouncements = announcements.filter(announcement => {
        if (filterType === 'all') return true;
        if (filterType === 'global') return !announcement.courseId;
        if (filterType === 'course') return announcement.courseId;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Announcement</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search announcements..."
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
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    <option value="all">All Announcements</option>
                    <option value="global">Global Only</option>
                    <option value="course">Course Specific</option>
                </select>
            </div>

            {/* Announcements List */}
            {loading ? (
                <LoadingSpinner size="lg" text="Loading announcements..." />
            ) : filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                    <Send className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new announcement.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className={`p-2 rounded-full ${announcement.courseId ? 'bg-blue-100' : 'bg-green-100'
                                            }`}>
                                            {announcement.courseId ? (
                                                <BookOpen className={`w-5 h-5 ${announcement.courseId ? 'text-blue-600' : 'text-green-600'
                                                    }`} />
                                            ) : (
                                                <Globe className="w-5 h-5 text-green-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${announcement.courseId
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {getCourseName(announcement.courseId)}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(announcement.postedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{announcement.message}</p>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        Posted by {announcement.postedByRole} • {new Date(announcement.postedAt).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(announcement)}
                                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(announcement.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
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
                            onClick={() => fetchAnnouncements(currentPage - 1, searchTerm)}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => fetchAnnouncements(currentPage + 1, searchTerm)}
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
                                        onClick={() => fetchAnnouncements(i, searchTerm)}
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

            {/* Modal for Add/Edit Announcement */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingAnnouncement(null);
                }}
                title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                size="lg"
            >
                <AnnouncementForm
                    announcement={editingAnnouncement}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingAnnouncement(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default AnnouncementList;