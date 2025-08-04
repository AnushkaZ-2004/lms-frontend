import React, { useState, useEffect } from 'react';

function StudentAssignments({ api, user }) {
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionData, setSubmissionData] = useState({
        description: '',
        fileUrl: ''
    });

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const [assignmentsData, submissionsData] = await Promise.all([
                api.getAssignments(),
                api.getSubmissions(null, user.id)
            ]);
            setAssignments(assignmentsData);
            setSubmissions(submissionsData);
        } catch (error) {
            console.error('Error loading assignments:', error);
        }
        setLoading(false);
    };

    const getSubmissionStatus = (assignmentId) => {
        const submission = submissions.find(s => s.assignmentId === assignmentId);
        if (!submission) return { status: 'not_submitted', submission: null };
        if (submission.marks !== null) return { status: 'graded', submission };
        return { status: 'submitted', submission };
    };

    const handleSubmitAssignment = (assignment) => {
        setSelectedAssignment(assignment);
        setSubmissionData({ description: '', fileUrl: '' });
        setShowSubmissionModal(true);
    };

    const handleSubmission = async () => {
        try {
            await api.createSubmission({
                assignmentId: selectedAssignment.id,
                studentId: user.id,
                description: submissionData.description,
                fileUrl: submissionData.fileUrl,
                submittedAt: new Date().toISOString()
            });
            setShowSubmissionModal(false);
            setSelectedAssignment(null);
            loadAssignments();
            alert('Assignment submitted successfully!');
        } catch (error) {
            alert('Error submitting assignment: ' + error.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading assignments...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📝 My Assignments</h1>
                <p className="page-subtitle">View and submit your assignments</p>
            </div>

            <div className="assignments-list">
                {assignments.map(assignment => {
                    const { status, submission } = getSubmissionStatus(assignment.id);
                    const isOverdue = new Date(assignment.dueDate) < new Date() && status === 'not_submitted';

                    return (
                        <div key={assignment.id} className="assignment-card">
                            <div className="assignment-header">
                                <h3 className="assignment-title">{assignment.title}</h3>
                                <div className={`status-badge ${status} ${isOverdue ? 'overdue' : ''}`}>
                                    {status === 'graded' ? '✅ Graded' :
                                        status === 'submitted' ? '⏳ Submitted' :
                                            isOverdue ? '⚠️ Overdue' : '❌ Not Submitted'}
                                </div>
                            </div>
                            <div className="assignment-content">
                                <p className="assignment-description">{assignment.description}</p>
                                <div className="assignment-meta">
                                    <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                                        📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        {isOverdue && ' (Overdue)'}
                                    </span>
                                    {submission && submission.marks !== null && (
                                        <span className="grade">
                                            📊 Grade: {submission.marks}/100
                                        </span>
                                    )}
                                </div>
                                <div className="assignment-actions">
                                    {status === 'not_submitted' && (
                                        <button
                                            className="primary-button"
                                            onClick={() => handleSubmitAssignment(assignment)}
                                        >
                                            📤 Submit Assignment
                                        </button>
                                    )}
                                    {status === 'submitted' && (
                                        <div className="submission-details">
                                            <p className="submission-info">
                                                📤 Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                            </p>
                                            {submission.description && (
                                                <p className="submission-description">
                                                    "{submission.description}"
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {status === 'graded' && (
                                        <div className="feedback-section">
                                            <div className="grade-display">
                                                <span className="grade-label">Your Grade:</span>
                                                <span className="grade-value">{submission.marks}/100</span>
                                            </div>
                                            {submission.feedback && (
                                                <div className="feedback">
                                                    <strong>📝 Instructor Feedback:</strong>
                                                    <p>{submission.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Submission Modal */}
            {showSubmissionModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>📤 Submit Assignment: {selectedAssignment?.title}</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowSubmissionModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-content">
                            <div className="form-group">
                                <label className="label">Description (Optional)</label>
                                <textarea
                                    className="textarea"
                                    value={submissionData.description}
                                    onChange={(e) => setSubmissionData({
                                        ...submissionData,
                                        description: e.target.value
                                    })}
                                    placeholder="Add any notes about your submission..."
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">File URL or Path</label>
                                <input
                                    className="input"
                                    type="text"
                                    value={submissionData.fileUrl}
                                    onChange={(e) => setSubmissionData({
                                        ...submissionData,
                                        fileUrl: e.target.value
                                    })}
                                    placeholder="Enter file URL or upload path..."
                                />
                                <small className="help-text">
                                    In a real implementation, this would be a file upload component
                                </small>
                            </div>
                            <div className="modal-actions">
                                <button
                                    className="secondary-button"
                                    onClick={() => setShowSubmissionModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="primary-button"
                                    onClick={handleSubmission}
                                    disabled={!submissionData.fileUrl}
                                >
                                    Submit Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentAssignments;