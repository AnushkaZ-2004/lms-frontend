import React, { useState, useEffect } from 'react';
import AnnouncementService from '../../services/AnnouncementService';
import CourseService from '../../services/CourseService';
import DataTable from '../../components/ui/DataTable';
import AnnouncementForm from '../../components/forms/AnnouncementForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManagePage.css';

function ManageAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [announcementsRes, coursesRes] = await Promise.all([
                    AnnouncementService.getAnnouncements(),
                    CourseService.getCourses()
                ]);
                setAnnouncements(announcementsRes.data);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (announcement) => {
        setCurrentAnnouncement(announcement);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await AnnouncementService.deleteAnnouncement(id);
                setAnnouncements(prev => prev.filter(a => a.id !== id));
            } catch (error) {
                console.error('Failed to delete announcement:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentAnnouncement) {
                await AnnouncementService.updateAnnouncement(currentAnnouncement.id, formData);
                setAnnouncements(prev => prev.map(a =>
                    a.id === currentAnnouncement.id ? { ...a, ...formData } : a
                ));
            } else {
                const response = await AnnouncementService.createAnnouncement(formData);
                setAnnouncements(prev => [...prev, response.data]);
            }
            setShowModal(false);
            setCurrentAnnouncement(null);
        } catch (error) {
            console.error('Failed to save announcement:', error);
        }
    };

    const getCourseName = (courseId) => {
        if (!courseId) return 'Global Announcement';
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCourseName(announcement.courseId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id', sortable: true },
        {
            header: 'Scope',
            accessor: 'courseId',
            render: (row) => getCourseName(row.courseId)
        },
        { header: 'Title', accessor: 'title', sortable: true },
        {
            header: 'Posted At',
            accessor: 'postedAt',
            render: (row) => new Date(row.postedAt).toLocaleString()
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="action-buttons">
                    <Button small onClick={() => handleEdit(row)}>Edit</Button>
                    <Button small danger onClick={() => handleDelete(row.id)}>Delete</Button>
                </div>
            ),
        },
    ];

    if (loading && announcements.length === 0) return <LoadingSpinner />;

    return (
        <div className="manage-page">
            <div className="page-header">
                <h1>Manage Announcements</h1>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Button
                        primary
                        onClick={() => {
                            setCurrentAnnouncement(null);
                            setShowModal(true);
                        }}
                    >
                        Add Announcement
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredAnnouncements}
                pagination
                itemsPerPage={10}
            />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setCurrentAnnouncement(null);
                }}
                title={currentAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
            >
                <AnnouncementForm
                    initialValues={currentAnnouncement || {}}
                    courses={courses}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
}

export default ManageAnnouncements;