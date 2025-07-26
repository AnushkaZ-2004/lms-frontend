import React, { useState, useEffect } from 'react';

function StudentsManagement({ api }) {
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]); // Store all students for filtering
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        registrationNo: ''
    });

    const itemsPerPage = 10;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Load students initially
    useEffect(() => {
        loadStudentsFromAPI();
    }, []);

    // Filter and paginate students when search term or page changes
    useEffect(() => {
        filterAndPaginateStudents();
    }, [debouncedSearchTerm, currentPage, allStudents]);

    // Reset to first page when search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchTerm) {
            setCurrentPage(0);
        }
    }, [debouncedSearchTerm]);

    // Fetch all students from API
    const loadStudentsFromAPI = async () => {
        setLoading(true);
        try {
            // Fetch all students with a large page size
            const data = await api.getStudents(0, 1000);
            const studentsList = data.content || data || [];
            setAllStudents(studentsList);
        } catch (error) {
            console.error('Error loading students:', error);
            setAllStudents([]);
        }
        setLoading(false);
    };

    // Client-side filtering and pagination
    const filterAndPaginateStudents = () => {
        let filteredStudents = allStudents;

        // Apply search filter
        if (debouncedSearchTerm.trim()) {
            const searchLower = debouncedSearchTerm.toLowerCase().trim();
            filteredStudents = allStudents.filter(student =>
                student.fullName?.toLowerCase().includes(searchLower) ||
                student.email?.toLowerCase().includes(searchLower) ||
                student.registrationNo?.toLowerCase().includes(searchLower)
            );
        }

        // Calculate pagination
        const totalElements = filteredStudents.length;
        const totalPagesCount = Math.ceil(totalElements / itemsPerPage);
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

        setStudents(paginatedStudents);
        setTotalPages(totalPagesCount);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingStudent) {
                await api.updateStudent(editingStudent.id, formData);
            } else {
                await api.createStudent(formData);
            }
            setShowModal(false);
            setEditingStudent(null);
            setFormData({ fullName: '', email: '', registrationNo: '' });
            // Reload data after create/update
            loadStudentsFromAPI();
        } catch (error) {
            alert('Error saving student: ' + error.message);
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            fullName: student.fullName,
            email: student.email,
            registrationNo: student.registrationNo
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.deleteStudent(id);
                // Reload data after delete
                loadStudentsFromAPI();
            } catch (error) {
                alert('Error deleting student: ' + error.message);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // Reset to first page when searching
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(0);
    };

    const handleRefresh = () => {
        loadStudentsFromAPI();
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Manage Students</h1>
                <div className="header-actions">

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingStudent(null);
                            setFormData({ fullName: '', email: '', registrationNo: '' });
                            setShowModal(true);
                        }}
                    >
                        Add New Student
                    </button>
                </div>
            </div>

            <div className="management-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search students by name, email or registration number..."
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
                        {students.length === 0 && !loading && (
                            <span className="no-results"> - No results found</span>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="loading">Loading students...</div>
            ) : (
                <>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Registration No</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.fullName}</td>
                                            <td>{student.email}</td>
                                            <td>{student.registrationNo}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEdit(student)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(student.id)}
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
                                                ? `No students found matching "${debouncedSearchTerm}"`
                                                : 'No students available'
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Results Summary */}
                    {!loading && (
                        <div className="results-summary">
                            <span>
                                {debouncedSearchTerm
                                    ? `Showing ${students.length} of ${allStudents.filter(student => {
                                        const searchLower = debouncedSearchTerm.toLowerCase().trim();
                                        return student.fullName?.toLowerCase().includes(searchLower) ||
                                            student.email?.toLowerCase().includes(searchLower) ||
                                            student.registrationNo?.toLowerCase().includes(searchLower);
                                    }).length} students (filtered from ${allStudents.length} total)`
                                    : `Showing ${students.length} of ${allStudents.length} students`
                                }
                            </span>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="btn btn-secondary"
                            >
                                Previous
                            </button>
                            <span>Page {currentPage + 1} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                className="btn btn-secondary"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
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
                                <label>Registration Number</label>
                                <input
                                    type="text"
                                    value={formData.registrationNo}
                                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="btn btn-primary">
                                    {editingStudent ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentsManagement;