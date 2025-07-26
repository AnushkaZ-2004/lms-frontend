import React, { useState, useEffect } from 'react';

function CoursesManagement({ api }) {
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        lecturerId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [coursesData, lecturersData] = await Promise.all([
                api.getCourses(),
                api.getLecturers()
            ]);
            setCourses(coursesData || []);
            setLecturers(lecturersData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingCourse) {
                await api.updateCourse(editingCourse.id, formData);
            } else {
                await api.createCourse(formData);
            }
            setShowModal(false);
            setEditingCourse(null);
            setFormData({ title: '', code: '', description: '', lecturerId: '' });
            loadData();
        } catch (error) {
            alert('Error saving course: ' + error.message);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            code: course.code,
            description: course.description,
            lecturerId: course.lecturerId || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.deleteCourse(id);
                loadData();
            } catch (error) {
                alert('Error deleting course: ' + error.message);
            }
        }
    };

    const getLecturerName = (lecturerId) => {
        const lecturer = lecturers.find(l => l.id === lecturerId);
        return lecturer ? lecturer.fullName : 'Unassigned';
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Manage Courses</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingCourse(null);
                        setFormData({ title: '', code: '', description: '', lecturerId: '' });
                        setShowModal(true);
                    }}
                >
                    Add New Course
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading courses...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Course Code</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Lecturer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.code}</td>
                                    <td>{course.title}</td>
                                    <td>{course.description}</td>
                                    <td>{getLecturerName(course.lecturerId)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handleEdit(course)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(course.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Course Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Course Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Assign Lecturer</label>
                                <select
                                    value={formData.lecturerId}
                                    onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
                                >
                                    <option value="">Select Lecturer</option>
                                    {lecturers.map(lecturer => (
                                        <option key={lecturer.id} value={lecturer.id}>
                                            {lecturer.fullName} - {lecturer.department}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="btn btn-primary">
                                    {editingCourse ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CoursesManagement;