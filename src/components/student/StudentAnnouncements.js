import React, { useState, useEffect } from 'react';

function StudentAnnouncements({ api, user }) {
    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const [announcementsData, coursesData] = await Promise.all([
                api.getAnnouncements(),
                api.getCourses()
            ]);
            setAnnouncements(announcementsData);
            setCourses(coursesData);
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
        setLoading(false);
    };

    const getCourseName = (courseId) => {
        if (!courseId) return 'General Announcement';
        const course = courses.find(c => c.id === courseId);
        return course ? course.title : 'Unknown Course';
    };

    if (loading) {
        return <div className="loading">Loading announcements...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📢 Announcements</h1>
                <p className="page-subtitle">Stay updated with important news and updates</p>
            </div>

            <div className="announcements-list">
                {announcements.length === 0 && (
                    <div className="empty-state">
                        <p>📭 No announcements yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentAnnouncements;
