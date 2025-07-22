
// Fixed StudentForm.jsx - Working Form
import React, { useState } from 'react';
import { Save, X, User, Mail, GraduationCap, AlertCircle } from 'lucide-react';

const StudentForm = ({ student, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: student?.fullName || '',
        email: student?.email || '',
        registrationNo: student?.registrationNo || ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.registrationNo.trim()) {
            newErrors.registrationNo = 'Registration number is required';
        } else if (formData.registrationNo.trim().length < 3) {
            newErrors.registrationNo = 'Registration number must be at least 3 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({}); // Clear any existing errors

        try {
            await onSubmit({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                registrationNo: formData.registrationNo.trim()
            });
            console.log('✅ Student saved successfully');
        } catch (error) {
            console.error('❌ Error saving student:', error);

            // Handle different types of errors
            if (error.response?.data?.message) {
                if (error.response.data.message.includes('Email already exists')) {
                    setErrors({ email: 'This email is already registered' });
                } else if (error.response.data.message.includes('email')) {
                    setErrors({ email: error.response.data.message });
                } else {
                    setErrors({ submit: error.response.data.message });
                }
            } else if (error.message) {
                setErrors({ submit: error.message });
            } else {
                setErrors({ submit: 'Failed to save student. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear submit error
        if (errors.submit) {
            setErrors(prev => ({ ...prev, submit: '' }));
        }
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Global Error */}
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <div>
                                <h4 className="text-sm font-medium text-red-800">Error</h4>
                                <p className="text-sm text-red-700">{errors.submit}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Name Field */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.fullName
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                            placeholder="Enter student's full name"
                        />
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.fullName ? 'text-red-400' : 'text-gray-400'
                            }`} />
                    </div>
                    {errors.fullName && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.fullName}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                            placeholder="Enter email address"
                        />
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-red-400' : 'text-gray-400'
                            }`} />
                    </div>
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Registration Number Field */}
                <div>
                    <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="registrationNo"
                            name="registrationNo"
                            value={formData.registrationNo}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.registrationNo
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300'
                                }`}
                            placeholder="Enter registration number (e.g., ST001)"
                        />
                        <GraduationCap className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${errors.registrationNo ? 'text-red-400' : 'text-gray-400'
                            }`} />
                    </div>
                    {errors.registrationNo && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.registrationNo}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2"
                    >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;