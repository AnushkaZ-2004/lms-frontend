import React, { useState, useEffect } from 'react';
import AssignmentService from '../../services/AssignmentService';
import CourseService from '../../services/CourseService';
import DataTable from '../../components/ui/DataTable';
import AssignmentForm from '../../components/forms/AssignmentForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManagePage.css';

function ManageAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [assignmentsRes, coursesRes] = await Promise.all([
                    AssignmentService.getAssignments(),
                    CourseService.getCourses()
                ]);
                setAssignments(assignmentsRes.data);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (assignment) => {
        setCurrentAssignment(assignment);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await AssignmentService.deleteAssignment(id);
                setAssignments(prev => prev.filter(a => a.id !== id));
            } catch (error) {
                console.error('Failed to delete assignment:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentAssignment) {
                await AssignmentService.updateAssignment(currentAssignment.id, formData);
                setAssignments(prev => prev.map(a =>
                    a.id === currentAssignment.id ? { ...a, ...formData } : a
                ));
            } else {
                const response = await AssignmentService.createAssignment(formData);
                setAssignments(prev => [...prev, response.data]);
            }
            setShowModal(false);
            setCurrentAssignment(null);
        } catch (error) {
            console.error('Failed to save assignment:', error);
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const filteredAssignments = assignments.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCourseName(assignment.courseId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id', sortable: true },
        {
            header: 'Course',
            accessor: 'courseId',
            render: (row) => getCourseName(row.courseId)
        },
        { header: 'Title', accessor: 'title', sortable: true },
        {
            header: 'Due Date',
            accessor: 'dueDate',
            render: (row) => new Date(row.dueDate).toLocaleDateString()
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="action-buttons">
                    <Button small onClick={() => handleEdit(row)}>Edit</Button>
                    <Button small danger onClick={() => handleDelete(row.id)}>Delete</Button>
                </div>
            ),
        },
    ];

    if (loading && assignments.length === 0) return <LoadingSpinner />;

    return (
        <div className="manage-page">
            <div className="page-header">
                <h1>Manage Assignments</h1>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Button
                        primary
                        onClick={() => {
                            setCurrentAssignment(null);
                            setShowModal(true);
                        }}
                    >
                        Add Assignment
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredAssignments}
                pagination
                itemsPerPage={10}
            />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setCurrentAssignment(null);
                }}
                title={currentAssignment ? 'Edit Assignment' : 'Add New Assignment'}
            >
                <AssignmentForm
                    initialValues={currentAssignment || {}}
                    courses={courses}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
}

export default ManageAssignments;