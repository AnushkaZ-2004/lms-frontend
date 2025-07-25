import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import './Form.css';

function AnnouncementForm({ initialValues, courses, onSubmit }) {
    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        message: ''
    });

    useEffect(() => {
        if (initialValues) {
            setFormData({
                courseId: initialValues.courseId || '',
                title: initialValues.title || '',
                message: initialValues.message || ''
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

    const courseOptions = [
        { value: '', label: 'Global Announcement' },
        ...courses.map(c => ({
            value: c.id,
            label: `${c.code} - ${c.title}`
        }))
    ];

    return (
        <form onSubmit={handleSubmit} className="form">
            <Select
                label="Scope"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                options={courseOptions}
            />
            <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <Input
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                textarea
                required
            />
            <div className="form-actions">
                <Button type="submit" primary>
                    {initialValues ? 'Update Announcement' : 'Add Announcement'}
                </Button>
            </div>
        </form>
    );
}

export default AnnouncementForm;