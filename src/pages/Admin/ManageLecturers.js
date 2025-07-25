import React, { useState, useEffect } from 'react';
import LecturerService from '../../services/LecturerService';
import DataTable from '../../components/ui/DataTable';
import LecturerForm from '../../components/forms/LecturerForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManagePage.css';

function ManageLecturers() {
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentLecturer, setCurrentLecturer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            setLoading(true);
            const response = await LecturerService.getLecturers();
            setLecturers(response.data);
        } catch (error) {
            console.error('Failed to fetch lecturers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (lecturer) => {
        setCurrentLecturer(lecturer);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lecturer?')) {
            try {
                await LecturerService.deleteLecturer(id);
                fetchLecturers();
            } catch (error) {
                console.error('Failed to delete lecturer:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentLecturer) {
                await LecturerService.updateLecturer(currentLecturer.id, formData);
            } else {
                await LecturerService.createLecturer(formData);
            }
            fetchLecturers();
            setShowModal(false);
            setCurrentLecturer(null);
        } catch (error) {
            console.error('Failed to save lecturer:', error);
        }
    };

    const filteredLecturers = lecturers.filter(lecturer =>
        lecturer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id', sortable: true },
        { header: 'Full Name', accessor: 'fullName', sortable: true },
        { header: 'Email', accessor: 'email', sortable: true },
        { header: 'Department', accessor: 'department', sortable: true },
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

    if (loading && lecturers.length === 0) return <LoadingSpinner />;

    return (
        <div className="manage-page">
            <div className="page-header">
                <h1>Manage Lecturers</h1>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search lecturers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Button
                        primary
                        onClick={() => {
                            setCurrentLecturer(null);
                            setShowModal(true);
                        }}
                    >
                        Add Lecturer
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredLecturers}
                pagination
                itemsPerPage={10}
            />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setCurrentLecturer(null);
                }}
                title={currentLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
            >
                <LecturerForm
                    initialValues={currentLecturer || {}}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
}

export default ManageLecturers;