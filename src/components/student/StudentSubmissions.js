import React, { useState, useEffect } from 'react';

function StudentSubmissions({ api, user }) {
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            const [submissionsData, assignmentsData] = await Promise.all([
                api.getSubmissions(null, user.id),
                api.getAssignments()
            ]);
            setSubmissions(submissionsData);
            setAssignments(assignmentsData);
        } catch (error) {
            console.error('Error loading submissions:', error);
        }
        setLoading(false);
    };

    const getAssignmentTitle = (assignmentId) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        return assignment ? assignment.title : 'Unknown Assignment';
    };

    if (loading) {
        return <div className="loading">Loading submissions...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">📤 My Submissions</h1>
                <p className="page-subtitle">Track all your submitted assignments</p>
            </div>

            <div className="submissions-list">
                {submissions.map(submission => (
                    <div key={submission.id} className="submission-card">
                        <div className="submission-header">
                            <h3 className="submission-title">
                                {getAssignmentTitle(submission.assignmentId)}
                            </h3>
                            <div className={`status-badge ${submission.marks !== null ? 'graded' : 'pending'}`}>
                                {submission.marks !== null ? '✅ Graded' : '⏳ Pending Review'}
                            </div>
                        </div>
                        <div className="submission-content">
                            <div className="submission-meta">
                                <span className="submission-date">
                                    📅 Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                </span>
                                {submission.marks !== null && (
                                    <span className="grade">
                                        📊 Grade: {submission.marks}/100
                                    </span>
                                )}
                            </div>
                            {submission.description && (
                                <p className="submission-description">
                                    📝 Description: {submission.description}
                                </p>
                            )}
                            {submission.fileUrl && (
                                <p className="file-info">
                                    📁 File: {submission.fileUrl}
                                </p>
                            )}
                            {submission.feedback && (
                                <div className="feedback">
                                    <strong>👨‍🏫 Instructor Feedback:</strong>
                                    <p>{submission.feedback}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {submissions.length === 0 && (
                    <div className="empty-state">
                        <p>📭 No submissions yet</p>
                        <p>Complete assignments to see your submissions here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentSubmissions;