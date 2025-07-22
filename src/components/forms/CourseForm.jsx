import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { lecturerService } from '../../services/lecturerService';

const CourseForm = ({ course, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: course?.title || '',
        code: course?.code || '',
        description: course?.description || '',
        lecturerId: course?.lecturerId || ''
    });
    const [lecturers, setLecturers] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingLecturers, setLoadingLecturers] = useState(true);

    useEffect(() => {
        const fetchLecturers = async () => {
            try {
                const response = await lecturerService.getAllLecturers(0, 100); // Get all lecturers
                setLecturers(response.content || []);
            } catch (error) {
                console.error('Error fetching lecturers:', error);
            } finally {
                setLoadingLecturers(false);
            }
        };

        fetchLecturers();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Course code is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Course description is required';
        }

        if (!formData.lecturerId) {
            newErrors.lecturerId = 'Please select a lecturer';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                lecturerId: parseInt(formData.lecturerId)
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: 'Failed to save course. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.submit}
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Enter course title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Code *
                </label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.code ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Enter course code (e.g., CS101)"
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Enter course description"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="lecturerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Lecturer *
                </label>
                {loadingLecturers ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        Loading lecturers...
                    </div>
                ) : (
                    <select
                        id="lecturerId"
                        name="lecturerId"
                        value={formData.lecturerId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.lecturerId ? 'border-red-300' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select a lecturer</option>
                        {lecturers.map((lecturer) => (
                            <option key={lecturer.id} value={lecturer.id}>
                                {lecturer.fullName} - {lecturer.department}
                            </option>
                        ))}
                    </select>
                )}
                {errors.lecturerId && <p className="text-red-500 text-xs mt-1">{errors.lecturerId}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2"
                >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                </button>
                <button
                    type="submit"
                    disabled={loading || loadingLecturers}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Course'}</span>
                </button>
            </div>
        </form>
    );
};

export default CourseForm;