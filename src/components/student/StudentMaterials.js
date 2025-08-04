import React, { useState, useEffect } from 'react';

function StudentMaterials({ api, user }) {
    const [materials, setMaterials] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        try {
            const [materialsData, coursesData] = await Promise.all([
                api.getMaterials(),
                api.getCourses()
            ]);
            setMaterials(materialsData);
            setCourses(coursesData);
        } catch (error) {
            console.error('Error loading materials:', error);
        }
        setLoading(false);
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.title : 'Unknown Course';
    };

    const filteredMaterials = selectedCourse
        ? materials.filter(material => material.courseId.toString() === selectedCourse)
        : materials;

    if (loading) {
        return <div className="loading">Loading course materials...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📁 Course Materials</h1>
                <p className="page-subtitle">Access learning resources and materials</p>
            </div>

            <div className="filter-section">
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="course-filter"
                >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="materials-list">
                {filteredMaterials.map(material => (
                    <div key={material.id} className="material-card">
                        <div className="material-header">
                            <h3 className="material-title">{material.title}</h3>
                            <div className="material-type">
                                {material.type === 'PDF' ? '📄' :
                                    material.type === 'VIDEO' ? '🎥' :
                                        material.type === 'DOCUMENT' ? '📄' : '📁'} {material.type}
                            </div>
                        </div>
                        <div className="material-content">
                            <p className="material-course">
                                📚 Course: {getCourseName(material.courseId)}
                            </p>
                            <p className="material-date">
                                📅 Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
                            </p>
                            <div className="material-actions">
                                <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="material-link"
                                >
                                    📥 Download/View
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredMaterials.length === 0 && (
                    <div className="empty-state">
                        <p>📭 No materials available</p>
                        {selectedCourse && <p>No materials found for selected course</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentMaterials;