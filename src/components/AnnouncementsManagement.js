import React, { useState, useEffect } from 'react';

function AnnouncementsManagement({ api }) {
    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        courseId: '' // null for global
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
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const announcementData = {
                ...formData,
                courseId: formData.courseId || null,
                postedByRole: 'ADMIN',
                postedById: user.id,
                postedAt: new Date().toISOString()
            };

            await api.createAnnouncement(announcementData);
            setShowModal(false);
            setFormData({ title: '', message: '', courseId: '' });
            loadData();
        } catch (error) {
            alert('Error creating announcement: ' + error.message);
        }
    };

    const getCourseName = (courseId) => {
        if (!courseId) return 'Global';
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Manage Announcements</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    Create Announcement
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading announcements...</div>
            ) : (
                <div className="announcements-list">
                    {announcements.map(announcement => (
                        <div key={announcement.id} className="announcement-card">
                            <div className="announcement-header">
                                <h3>{announcement.title}</h3>
                                <span className="announcement-scope">
                                    {getCourseName(announcement.courseId)}
                                </span>
                            </div>
                            <div className="announcement-content">
                                <p>{announcement.message}</p>
                            </div>
                            <div className="announcement-footer">
                                <span>Posted by {announcement.postedByRole}</span>
                                <span>{new Date(announcement.postedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Create Announcement</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="Announcement title"
                                />
                            </div>
                            <div className="form-group">
                                <label>Target Audience</label>
                                <select
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                >
                                    <option value="">Global (All users)</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} - {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows="6"
                                    placeholder="Enter your announcement message..."
                                />
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="btn btn-primary">
                                    Post Announcement
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