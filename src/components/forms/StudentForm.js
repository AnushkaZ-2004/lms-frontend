import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import './Form.css';

function StudentForm({ initialValues, onSubmit }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        registrationNo: ''
    });

    useEffect(() => {
        if (initialValues) {
            setFormData({
                fullName: initialValues.fullName || '',
                email: initialValues.email || '',
                registrationNo: initialValues.registrationNo || ''
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
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
            />
            <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <Input
                label="Registration Number"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                required
            />
            <div className="form-actions">
                <Button type="submit" primary>
                    {initialValues ? 'Update Student' : 'Add Student'}
                </Button>
            </div>
        </form>
    );
}

export default StudentForm;