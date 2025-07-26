import React, { useState, useEffect } from 'react';

function LecturersManagement({ api }) {
    const [lecturers, setLecturers] = useState([]);
    const [allLecturers, setAllLecturers] = useState([]); // Store all lecturers for filtering
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        department: ''
    });

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Load lecturers initially
    useEffect(() => {
        loadLecturersFromAPI();
    }, []);

    // Filter lecturers when search term changes
    useEffect(() => {
        filterLecturers();
    }, [debouncedSearchTerm, allLecturers]);

    // Fetch all lecturers from API
    const loadLecturersFromAPI = async () => {
        setLoading(true);
        try {
            // Fetch all lecturers without search parameter
            const data = await api.getLecturers();
            const lecturersList = data || [];
            setAllLecturers(lecturersList);
        } catch (error) {
            console.error('Error loading lecturers:', error);
            setAllLecturers([]);
        }
        setLoading(false);
    };

    // Client-side filtering
    const filterLecturers = () => {
        if (!debouncedSearchTerm.trim()) {
            // No search term, show all lecturers
            setLecturers(allLecturers);
        } else {
            // Apply search filter
            const searchLower = debouncedSearchTerm.toLowerCase().trim();
            const filteredLecturers = allLecturers.filter(lecturer =>
                lecturer.fullName?.toLowerCase().includes(searchLower) ||
                lecturer.email?.toLowerCase().includes(searchLower) ||
                lecturer.department?.toLowerCase().includes(searchLower)
            );
            setLecturers(filteredLecturers);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingLecturer) {
                await api.updateLecturer(editingLecturer.id, formData);
            } else {
                await api.createLecturer(formData);
            }
            setShowModal(false);
            setEditingLecturer(null);
            setFormData({ fullName: '', email: '', department: '' });
            // Reload data after create/update
            loadLecturersFromAPI();
        } catch (error) {
            alert('Error saving lecturer: ' + error.message);
        }
    };

    const handleEdit = (lecturer) => {
        setEditingLecturer(lecturer);
        setFormData({
            fullName: lecturer.fullName,
            email: lecturer.email,
            department: lecturer.department
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lecturer?')) {
            try {
                await api.deleteLecturer(id);
                // Reload data after delete
                loadLecturersFromAPI();
            } catch (error) {
                alert('Error deleting lecturer: ' + error.message);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleRefresh = () => {
        loadLecturersFromAPI();
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Manage Lecturers</h1>
                <div className="header-actions">

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingLecturer(null);
                            setFormData({ fullName: '', email: '', department: '' });
                            setShowModal(true);
                        }}
                    >
                        Add New Lecturer
                    </button>
                </div>
            </div>

            <div className="management-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search lecturers by name, email or department..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {searchTerm && (
                        <button
                            className="search-clear-btn"
                            onClick={handleClearSearch}
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {debouncedSearchTerm && (
                    <div className="search-info">
                        <span>Searching for: "{debouncedSearchTerm}"</span>
                        {lecturers.length === 0 && !loading && (
                            <span className="no-results"> - No results found</span>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="loading">Loading lecturers...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lecturers.length > 0 ? (
                                lecturers.map(lecturer => (
                                    <tr key={lecturer.id}>
                                        <td>{lecturer.id}</td>
                                        <td>{lecturer.fullName}</td>
                                        <td>{lecturer.email}</td>
                                        <td>{lecturer.department}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleEdit(lecturer)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(lecturer.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-data">
                                        {debouncedSearchTerm
                                            ? `No lecturers found matching "${debouncedSearchTerm}"`
                                            : 'No lecturers available'
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Results Summary */}
            {!loading && (
                <div className="results-summary">
                    <span>
                        {debouncedSearchTerm
                            ? `Showing ${lecturers.length} of ${allLecturers.length} lecturers`
                            : `Total: ${lecturers.length} lecturers`
                        }
                    </span>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="btn btn-primary">
                                    {editingLecturer ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LecturersManagement;