import React, { useState, useEffect } from 'react';
import SubmissionService from '../../services/SubmissionService';
import AssignmentService from '../../services/AssignmentService';
import StudentService from '../../services/StudentService';
import DataTable from '../../components/ui/DataTable';
import SubmissionReviewForm from '../../components/forms/SubmissionReviewForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManagePage.css';

function ManageSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [submissionsRes, assignmentsRes, studentsRes] = await Promise.all([
                    SubmissionService.getSubmissions(),
                    AssignmentService.getAssignments(),
                    StudentService.getStudents()
                ]);
                setSubmissions(submissionsRes.data);
                setAssignments(assignmentsRes.data);
                setStudents(studentsRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleReview = (submission) => {
        setCurrentSubmission(submission);
        setShowModal(true);
    };

    const getAssignmentTitle = (assignmentId) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        return assignment ? assignment.title : 'Unknown Assignment';
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.fullName : 'Unknown Student';
    };

    const handleSubmitReview = async (formData) => {
        try {
            await SubmissionService.reviewSubmission(currentSubmission.id, formData);
            setSubmissions(prev => prev.map(s =>
                s.id === currentSubmission.id ? { ...s, ...formData } : s
            ));
            setShowModal(false);
            setCurrentSubmission(null);
        } catch (error) {
            console.error('Failed to review submission:', error);
        }
    };

    const filteredSubmissions = submissions.filter(submission =>
        getAssignmentTitle(submission.assignmentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStudentName(submission.studentId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id', sortable: true },
        {
            header: 'Assignment',
            accessor: 'assignmentId',
            render: (row) => getAssignmentTitle(row.assignmentId)
        },
        {
            header: 'Student',
            accessor: 'studentId',
            render: (row) => getStudentName(row.studentId)
        },
        {
            header: 'Submitted At',
            accessor: 'submittedAt',
            render: (row) => new Date(row.submittedAt).toLocaleString()
        },
        {
            header: 'Status',
            accessor: 'marks',
            render: (row) => row.marks !== null ? 'Reviewed' : 'Pending Review'
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="action-buttons">
                    <Button
                        small
                        onClick={() => handleReview(row)}
                        disabled={row.marks !== null}
                    >
                        {row.marks !== null ? 'Reviewed' : 'Review'}
                    </Button>
                </div>
            ),
        },
    ];

    if (loading && submissions.length === 0) return <LoadingSpinner />;

    return (
        <div className="manage-page">
            <div className="page-header">
                <h1>Manage Submissions</h1>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredSubmissions}
                pagination
                itemsPerPage={10}
            />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setCurrentSubmission(null);
                }}
                title="Review Submission"
            >
                <SubmissionReviewForm
                    initialValues={currentSubmission || {}}
                    onSubmit={handleSubmitReview}
                />
            </Modal>
        </div>
    );
}

export default ManageSubmissions;