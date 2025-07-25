import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentService from '../../services/StudentService';
import DataTable from '../../components/ui/DataTable';
import StudentForm from '../../components/forms/StudentForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManagePage.css';

function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await StudentService.getStudents();
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student) => {
        setCurrentStudent(student);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await StudentService.deleteStudent(id);
                fetchStudents();
            } catch (error) {
                console.error('Failed to delete student:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentStudent) {
                await StudentService.updateStudent(currentStudent.id, formData);
            } else {
                await StudentService.createStudent(formData);
            }
            fetchStudents();
            setShowModal(false);
            setCurrentStudent(null);
        } catch (error) {
            console.error('Failed to save student:', error);
        }
    };

    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id', sortable: true },
        { header: 'Full Name', accessor: 'fullName', sortable: true },
        { header: 'Email', accessor: 'email', sortable: true },
        { header: 'Registration No', accessor: 'registrationNo', sortable: true },
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

    if (loading && students.length === 0) return <LoadingSpinner />;

    return (
        <div className="manage-page">
            <div className="page-header">
                <h1>Manage Students</h1>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Button
                        primary
                        onClick={() => {
                            setCurrentStudent(null);
                            setShowModal(true);
                        }}
                    >
                        Add Student
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredStudents}
                pagination
                itemsPerPage={10}
            />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setCurrentStudent(null);
                }}
                title={currentStudent ? 'Edit Student' : 'Add New Student'}
            >
                <StudentForm
                    initialValues={currentStudent || {}}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
}

export default ManageStudents;