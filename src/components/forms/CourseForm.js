import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import LecturerService from '../../services/LecturerService';
import './Form.css';

function CourseForm({ initialValues, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        lecturerId: ''
    });
    const [lecturers, setLecturers] = useState([]);
    const [loadingLecturers, setLoadingLecturers] = useState(true);

    useEffect(() => {
        const fetchLecturers = async () => {
            try {
                const response = await LecturerService.getLecturers();
                setLecturers(response.data);
            } catch (error) {
                console.error('Failed to fetch lecturers:', error);
            } finally {
                setLoadingLecturers(false);
            }
        };

        fetchLecturers();
    }, []);

    useEffect(() => {
        if (initialValues) {
            setFormData({
                title: initialValues.title || '',
                code: initialValues.code || '',
                description: initialValues.description || '',
                lecturerId: initialValues.lecturerId || ''
            });
        }
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <Input
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <Input
                label="Course Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
            />
            <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                textarea
            />
            <Select
                label="Lecturer"
                name="lecturerId"
                value={formData.lecturerId}
                onChange={handleChange}
                options={lecturers.map(l => ({
                    value: l.id,
                    label: `${l.fullName} (${l.email})`
                }))}
                loading={loadingLecturers}
                required
            />
            <div className="form-actions">
                <Button type="submit" primary>
                    {initialValues ? 'Update Course' : 'Add Course'}
                </Button>
            </div>
        </form>
    );
}

export default CourseForm;