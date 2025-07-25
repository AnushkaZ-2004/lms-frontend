import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import './Form.css';

function SubmissionReviewForm({ initialValues, onSubmit }) {
    const [formData, setFormData] = useState({
        marks: '',
        feedback: ''
    });

    useEffect(() => {
        if (initialValues) {
            setFormData({
                marks: initialValues.marks || '',
                feedback: initialValues.feedback || ''
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
        onSubmit({
            ...formData,
            marks: parseInt(formData.marks, 10)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <Input
                label="Marks"
                type="number"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                min="0"
                max="100"
                required
            />
            <Input
                label="Feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                textarea
            />
            <div className="form-actions">
                <Button type="submit" primary>
                    Submit Review
                </Button>
            </div>
        </form>
    );
}

export default SubmissionReviewForm;