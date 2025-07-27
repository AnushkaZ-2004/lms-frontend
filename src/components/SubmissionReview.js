import React, { useState, useEffect } from 'react';

function SubmissionReview({ api }) {
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewData, setReviewData] = useState({
        marks: '',
        feedback: ''
    });
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, reviewed
    const [selectedAssignment, setSelectedAssignment] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            console.log('Loading submission review data...');

            const [submissionsData, assignmentsData, studentsData] = await Promise.all([
                api.getSubmissions().catch(err => {
                    console.error('Error loading submissions:', err);
                    return [];
                }),
                api.getAssignments().catch(err => {
                    console.error('Error loading assignments:', err);
                    return [];
                }),
                api.getStudents(0, 1000).catch(err => {
                    console.error('Error loading students:', err);
                    return { content: [] };
                })
            ]);

            console.log('Loaded data:', {
                submissions: submissionsData?.length || 0,
                assignments: assignmentsData?.length || 0,
                students: studentsData?.content?.length || studentsData?.length || 0
            });

            setSubmissions(submissionsData || []);
            setAssignments(assignmentsData || []);
            setStudents(studentsData.content || studentsData || []);

        } catch (error) {
            console.error('Error loading data:', error);
            setSubmissions([]);
            setAssignments([]);
            setStudents([]);
        }
        setLoading(false);
    };

    const handleReviewSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!reviewData.marks || reviewData.marks < 0 || reviewData.marks > 100) {
            alert('Please enter valid marks (0-100)');
            return;
        }

        try {
            console.log('Submitting review:', {
                id: selectedSubmission.id,
                marks: parseInt(reviewData.marks),
                feedback: reviewData.feedback
            });

            await api.updateSubmission(
                selectedSubmission.id,
                parseInt(reviewData.marks),
                reviewData.feedback || ''
            );

            setSelectedSubmission(null);
            setReviewData({ marks: '', feedback: '' });
            await loadData(); // Reload data to show updated status

            alert('Submission reviewed successfully!');
        } catch (error) {
            console.error('Error reviewing submission:', error);
            alert('Error reviewing submission: ' + error.message);
        }
    };

    const handleDeleteSubmission = async (id) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await api.deleteSubmission(id);
                await loadData();
                alert('Submission deleted successfully!');
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Error deleting submission: ' + error.message);
            }
        }
    };

    const getAssignmentTitle = (assignmentId) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        return assignment ? assignment.title : 'Unknown Assignment';
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.fullName : 'Unknown Student';
    };

    const filteredSubmissions = submissions.filter(submission => {
        // Filter by status
        if (filterStatus === 'pending' && submission.marks !== null) return false;
        if (filterStatus === 'reviewed' && submission.marks === null) return false;

        // Filter by assignment
        if (selectedAssignment && submission.assignmentId.toString() !== selectedAssignment) return false;

        return true;
    });

    const getStatusBadge = (submission) => {
        if (submission.marks !== null && submission.marks !== undefined) {
            return <span className="status reviewed">Reviewed</span>;
        }
        return <span className="status pending">Pending</span>;
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return <div className="loading">Loading submissions...</div>;
    }

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Submission Review</h1>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={loadData}
                        title="Refresh List"
                    >
                        🔄 Refresh
                    </button>
                    <span className="submission-count">
                        Total: {filteredSubmissions.length} submissions
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="management-controls">
                <div className="filter-section">
                    <div className="filter-group">
                        <label>Filter by Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Submissions</option>
                            <option value="pending">Pending Review</option>
                            <option value="reviewed">Reviewed</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Filter by Assignment:</label>
                        <select
                            value={selectedAssignment}
                            onChange={(e) => setSelectedAssignment(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Assignments</option>
                            {assignments.map(assignment => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Assignment</th>
                            <th>Submitted At</th>
                            <th>File</th>
                            <th>Description</th>
                            <th>Marks</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubmissions.length > 0 ? (
                            filteredSubmissions.map(submission => (
                                <tr key={submission.id}>
                                    <td>{submission.id}</td>
                                    <td>{getStudentName(submission.studentId)}</td>
                                    <td>{getAssignmentTitle(submission.assignmentId)}</td>
                                    <td>{formatDate(submission.submittedAt)}</td>
                                    <td>
                                        {submission.fileUrl ? (
                                            <a
                                                href={submission.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="file-link"
                                            >
                                                📁 View File
                                            </a>
                                        ) : (
                                            <span className="no-file">No file</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="description-cell" title={submission.description}>
                                            {submission.description || 'No description'}
                                        </div>
                                    </td>
                                    <td>
                                        {submission.marks !== null && submission.marks !== undefined
                                            ? `${submission.marks}/100`
                                            : 'Not graded'
                                        }
                                    </td>
                                    <td>{getStatusBadge(submission)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => {
                                                    setSelectedSubmission(submission);
                                                    setReviewData({
                                                        marks: submission.marks || '',
                                                        feedback: submission.feedback || ''
                                                    });
                                                }}
                                                title={submission.marks ? 'Edit Review' : 'Add Review'}
                                            >
                                                {submission.marks ? '✏️ Edit' : '📝 Review'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteSubmission(submission.id)}
                                                title="Delete Submission"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="no-data">
                                    {submissions.length === 0
                                        ? 'No submissions available'
                                        : 'No submissions match the current filters'
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Review Modal */}
            {selectedSubmission && (
                <div className="modal-overlay">
                    <div className="modal large-modal">
                        <div className="modal-header">
                            <h3>
                                {selectedSubmission.marks ? 'Edit Review' : 'Review Submission'}
                            </h3>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="submission-details">
                            <h4>Submission Details</h4>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <strong>Student:</strong>
                                    <span>{getStudentName(selectedSubmission.studentId)}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Assignment:</strong>
                                    <span>{getAssignmentTitle(selectedSubmission.assignmentId)}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Submitted At:</strong>
                                    <span>{formatDate(selectedSubmission.submittedAt)}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Description:</strong>
                                    <span>{selectedSubmission.description || 'No description provided'}</span>
                                </div>
                                {selectedSubmission.fileUrl && (
                                    <div className="detail-item">
                                        <strong>File:</strong>
                                        <a
                                            href={selectedSubmission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-link"
                                        >
                                            📁 View Submission File
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-form">
                            <div className="form-group">
                                <label>Marks (0-100) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={reviewData.marks}
                                    onChange={(e) => setReviewData({ ...reviewData, marks: e.target.value })}
                                    required
                                    placeholder="Enter marks (0-100)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Feedback</label>
                                <textarea
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                                    rows="4"
                                    placeholder="Provide feedback to the student..."
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReviewSubmit}
                                    className="btn btn-primary"
                                    disabled={!reviewData.marks}
                                >
                                    {selectedSubmission.marks ? 'Update Review' : 'Save Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubmissionReview;