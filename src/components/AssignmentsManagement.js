import React, { useState, useEffect } from 'react';

function AssignmentsManagement({ api }) {
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        courseId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [assignmentsData, coursesData] = await Promise.all([
                api.getAssignments(),
                api.getCourses()
            ]);
            setAssignments(assignmentsData || []);
            setCourses(coursesData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingAssignment) {
                await api.updateAssignment(editingAssignment.id, formData);
            } else {
                await api.createAssignment(formData);
            }
            setShowModal(false);
            setEditingAssignment(null);
            setFormData({ title: '', description: '', dueDate: '', courseId: '' });
            loadData();
        } catch (error) {
            alert('Error saving assignment: ' + error.message);
        }
    };

    const handleEdit = (assignment) => {
        setEditingAssignment(assignment);
        setFormData({
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
            courseId: assignment.courseId || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await api.deleteAssignment(id);
                loadData();
            } catch (error) {
                alert('Error deleting assignment: ' + error.message);
            }
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Manage Assignments</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingAssignment(null);
                        setFormData({ title: '', description: '', dueDate: '', courseId: '' });
                        setShowModal(true);
                    }}
                >
                    Add New Assignment
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading assignments...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment.id}>
                                    <td>{assignment.id}</td>
                                    <td>{assignment.title}</td>
                                    <td>{getCourseName(assignment.courseId)}</td>
                                    <td>{assignment.dueDate}</td>
                                    <td>{assignment.description}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handleEdit(assignment)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(assignment.id)}
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
                            <h3>{editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Assignment Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Course</label>
                                <select
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} - {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows="4"
                                />
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="btn btn-primary">
                                    {editingAssignment ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignmentsManagement;