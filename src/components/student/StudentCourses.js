import React, { useState, useEffect } from 'react';

function StudentCourses({ api, user }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const coursesData = await api.getCourses();
            setCourses(coursesData);
        } catch (error) {
            console.error('Error loading courses:', error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="loading">Loading courses...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📚 My Courses</h1>
                <p className="page-subtitle">Access your enrolled courses and materials</p>
            </div>

            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <div className="course-card-header">
                            <h3 className="course-card-title">{course.title}</h3>
                            <span className="course-code">{course.code}</span>
                        </div>
                        <div className="course-card-content">
                            <p className="course-description">{course.description}</p>
                            <div className="course-actions">
                                <button className="primary-button">
                                    📖 View Course
                                </button>
                                <button className="secondary-button">
                                    📁 Materials
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentCourses;