import React, { useState, useEffect } from 'react';
import { Save, X, Calendar } from 'lucide-react';
import { courseService } from '../../services/courseService';

const AssignmentForm = ({ assignment, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: assignment?.title || '',
        description: assignment?.description || '',
        dueDate: assignment?.dueDate || '',
        courseId: assignment?.courseId || ''
    });
    const [courses, setCourses] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAllCourses(0, 100);
                setCourses(response.content || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Assignment title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Assignment description is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        } else {
            const today = new Date();
            const dueDate = new Date(formData.dueDate);
            today.setHours(0, 0, 0, 0);

            if (dueDate < today) {
                newErrors.dueDate = 'Due date cannot be in the past';
            }
        }

        if (!formData.courseId) {
            newErrors.courseId = 'Please select a course';
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
                courseId: parseInt(formData.courseId)
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: 'Failed to save assignment. Please try again.' });
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
                    Assignment Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Enter assignment title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                </label>
                {loadingCourses ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        Loading courses...
                    </div>
                ) : (
                    <select
                        id="courseId"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.courseId ? 'border-red-300' : 'border-gray-300'
                            }`}
                    >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.code} - {course.title}
                            </option>
                        ))}
                    </select>
                )}
                {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>}
            </div>

            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                </label>
                <div className="relative">
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.dueDate ? 'border-red-300' : 'border-gray-300'
                            }`}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
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
                    rows={5}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Enter assignment description, requirements, and instructions"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
                    disabled={loading || loadingCourses}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Assignment'}</span>
                </button>
            </div>
        </form>
    );
};

export default AssignmentForm;