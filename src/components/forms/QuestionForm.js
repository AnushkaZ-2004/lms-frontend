import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import './Form.css';

function QuestionForm({ initialValues, onSubmit }) {
    const [formData, setFormData] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A'
    });

    useEffect(() => {
        if (initialValues) {
            setFormData({
                questionText: initialValues.questionText || '',
                optionA: initialValues.optionA || '',
                optionB: initialValues.optionB || '',
                optionC: initialValues.optionC || '',
                optionD: initialValues.optionD || '',
                correctAnswer: initialValues.correctAnswer || 'A'
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
                label="Question Text"
                name="questionText"
                value={formData.questionText}
                onChange={handleChange}
                required
                textarea
            />

            <div className="options-grid">
                <Input
                    label="Option A"
                    name="optionA"
                    value={formData.optionA}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Option B"
                    name="optionB"
                    value={formData.optionB}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Option C"
                    name="optionC"
                    value={formData.optionC}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Option D"
                    name="optionD"
                    value={formData.optionD}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Correct Answer</label>
                <div className="options-radio">
                    {['A', 'B', 'C', 'D'].map(option => (
                        <label key={option} className="radio-label">
                            <input
                                type="radio"
                                name="correctAnswer"
                                value={option}
                                checked={formData.correctAnswer === option}
                                onChange={handleChange}
                                required
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-actions">
                <Button type="submit" primary>
                    {initialValues ? 'Update Question' : 'Add Question'}
                </Button>
            </div>
        </form>
    );
}

export default QuestionForm;