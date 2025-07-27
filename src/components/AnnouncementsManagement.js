import React, { useState, useEffect } from 'react';

function AnnouncementsManagement({ api }) {
    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        courseId: '' // Will be converted to null for global announcements
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [announcementsData, coursesData] = await Promise.all([
                api.getAnnouncements(),
                api.getCourses()
            ]);
            setAnnouncements(announcementsData || []);
            setCourses(coursesData || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setAnnouncements([]);
            setCourses([]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            // Prepare announcement data according to your backend model
            const announcementData = {
                title: formData.title.trim(),
                message: formData.message.trim(),
                courseId: formData.courseId ? parseInt(formData.courseId) : null, // Convert to null for global
                postedByRole: 'ADMIN',
                postedById: user.id,
                // postedAt will be set by backend service
            };

            console.log('Sending announcement data:', announcementData);

            await api.createAnnouncement(announcementData);
            setShowModal(false);
            setFormData({ title: '', message: '', courseId: '' });
            loadData();
            alert('Announcement created successfully!');
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Error creating announcement: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await api.deleteAnnouncement(id);
                loadData();
                alert('Announcement deleted successfully!');
            } catch (error) {
                console.error('Error deleting announcement:', error);
                alert('Error deleting announcement: ' + error.message);
            }
        }
    };

    const getCourseName = (courseId) => {
        if (!courseId) return 'Global';
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleString();
        } catch (error) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Manage Announcements</h1>
                <div className="header-actions">

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setFormData({ title: '', message: '', courseId: '' });
                            setShowModal(true);
                        }}
                    >
                        Create Announcement
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading announcements...</div>
            ) : (
                <>
                    {announcements.length === 0 ? (
                        <div className="no-announcements">
                            <div className="empty-state">
                                <h3>No Announcements</h3>
                                <p>Create your first announcement to get started.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowModal(true)}
                                >
                                    Create First Announcement
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="announcements-list">
                            {announcements.map(announcement => (
                                <div key={announcement.id} className="announcement-card">
                                    <div className="announcement-header">
                                        <div className="announcement-title-section">
                                            <h3>{announcement.title}</h3>
                                            <span className="announcement-id">ID: {announcement.id}</span>
                                        </div>
                                        <div className="announcement-actions">
                                            <span className="announcement-scope">
                                                {getCourseName(announcement.courseId)}
                                            </span>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(announcement.id)}
                                                title="Delete Announcement"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="announcement-content">
                                        <p>{announcement.message}</p>
                                    </div>
                                    <div className="announcement-footer">
                                        <div className="announcement-meta">
                                            <span>Posted by: {announcement.postedByRole}</span>
                                            <span>Posted by ID: {announcement.postedById}</span>
                                        </div>
                                        <div className="announcement-date">
                                            <span>{formatDate(announcement.postedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal large-modal">
                        <div className="modal-header">
                            <h3>Create New Announcement</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="Enter announcement title"
                                    maxLength="255"
                                />
                            </div>
                            <div className="form-group">
                                <label>Target Audience</label>
                                <select
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                >
                                    <option value="">🌍 Global (All users)</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            📚 {course.code} - {course.title}
                                        </option>
                                    ))}
                                </select>
                                <small className="form-hint">
                                    Leave as Global to send to all users, or select a specific course
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows="8"
                                    placeholder="Enter your announcement message..."
                                    maxLength="2000"
                                />
                                <small className="form-hint">
                                    {formData.message.length}/2000 characters
                                </small>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={!formData.title.trim() || !formData.message.trim()}
                                >
                                    📢 Post Announcement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnnouncementsManagement;