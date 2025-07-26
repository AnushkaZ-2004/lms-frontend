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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [submissionsData, assignmentsData, studentsData] = await Promise.all([
                api.getSubmissions(),
                api.getAssignments(),
                api.getStudents(0, 1000) // Get all students
            ]);
            setSubmissions(submissionsData || []);
            setAssignments(assignmentsData || []);
            setStudents(studentsData.content || studentsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const handleReviewSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            await api.updateSubmission(
                selectedSubmission.id,
                parseInt(reviewData.marks),
                reviewData.feedback
            );
            setSelectedSubmission(null);
            setReviewData({ marks: '', feedback: '' });
            loadData();
            alert('Submission reviewed successfully!');
        } catch (error) {
            alert('Error reviewing submission: ' + error.message);
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

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Submission Review</h1>
                <p>Review and grade student submissions</p>
            </div>

            {loading ? (
                <div className="loading">Loading submissions...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student</th>
                                <th>Assignment</th>
                                <th>Submitted At</th>
                                <th>File</th>
                                <th>Marks</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(submission => (
                                <tr key={submission.id}>
                                    <td>{submission.id}</td>
                                    <td>{getStudentName(submission.studentId)}</td>
                                    <td>{getAssignmentTitle(submission.assignmentId)}</td>
                                    <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                                    <td>
                                        {submission.fileUrl && (
                                            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                                                View File
                                            </a>
                                        )}
                                    </td>
                                    <td>{submission.marks || 'Not graded'}</td>
                                    <td>
                                        <span className={`status ${submission.marks ? 'reviewed' : 'pending'}`}>
                                            {submission.marks ? 'Reviewed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => {
                                                setSelectedSubmission(submission);
                                                setReviewData({
                                                    marks: submission.marks || '',
                                                    feedback: submission.feedback || ''
                                                });
                                            }}
                                        >
                                            {submission.marks ? 'Edit Review' : 'Review'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedSubmission && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Review Submission</h3>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="submission-details">
                            <h4>Submission Details</h4>
                            <p><strong>Student:</strong> {getStudentName(selectedSubmission.studentId)}</p>
                            <p><strong>Assignment:</strong> {getAssignmentTitle(selectedSubmission.assignmentId)}</p>
                            <p><strong>Submitted At:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                            <p><strong>Description:</strong> {selectedSubmission.description}</p>
                            {selectedSubmission.fileUrl && (
                                <p><strong>File:</strong>
                                    <a href={selectedSubmission.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                                        View Submission File
                                    </a>
                                </p>
                            )}
                        </div>

                        <div className="modal-form">
                            <div className="form-group">
                                <label>Marks</label>
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
                                <button onClick={() => setSelectedSubmission(null)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleReviewSubmit} className="btn btn-primary">
                                    Save Review
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