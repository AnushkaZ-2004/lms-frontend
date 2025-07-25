import React, { useState, useEffect } from 'react';
import CourseService from '../../services/CourseService';
import DataTable from '../../components/ui/DataTable';
import CourseForm from '../../components/forms/CourseForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManagePage.css';

function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await CourseService.getCourses();
            setCourses(response.data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setCurrentCourse(course);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await CourseService.deleteCourse(id);
                fetchCourses();
            } catch (error) {
                console.error('Failed to delete course:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentCourse) {
                await CourseService.updateCourse(currentCourse.id, formData);
            } else {
                await CourseService.createCourse(formData);
            }
            fetchCourses();
            setShowModal(false);
            setCurrentCourse(null);
        } catch (error) {
            console.error('Failed to save course:', error);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id', sortable: true },
        { header: 'Title', accessor: 'title', sortable: true },
        { header: 'Code', accessor: 'code', sortable: true },
        { header: 'Description', accessor: 'description' },
        { header: 'Lecturer ID', accessor: 'lecturerId' },
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

    if (loading && courses.length === 0) return <LoadingSpinner />;

    return (
        <div className="manage-page">
            <div className="page-header">
                <h1>Manage Courses</h1>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Button
                        primary
                        onClick={() => {
                            setCurrentCourse(null);
                            setShowModal(true);
                        }}
                    >
                        Add Course
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredCourses}
                pagination
                itemsPerPage={10}
            />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setCurrentCourse(null);
                }}
                title={currentCourse ? 'Edit Course' : 'Add New Course'}
            >
                <CourseForm
                    initialValues={currentCourse || {}}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
}

export default ManageCourses;