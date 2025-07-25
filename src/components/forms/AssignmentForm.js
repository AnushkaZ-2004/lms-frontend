import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import './Form.css';

function AssignmentForm({ initialValues, courses, onSubmit }) {
    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        description: '',
        dueDate: ''
    });

    useEffect(() => {
        if (initialValues) {
            setFormData({
                courseId: initialValues.courseId || '',
                title: initialValues.title || '',
                description: initialValues.description || '',
                dueDate: initialValues.dueDate ? initialValues.dueDate.split('T')[0] : ''
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
            <Select
                label="Course"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                options={courses.map(c => ({
                    value: c.id,
                    label: `${c.code} - ${c.title}`
                }))}
                required
            />
            <Input
                label="Title"
                name="title"
                value={formData.title}
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
            <Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
            />
            <div className="form-actions">
                <Button type="submit" primary>
                    {initialValues ? 'Update Assignment' : 'Add Assignment'}
                </Button>
            </div>
        </form>
    );
}

export default AssignmentForm;