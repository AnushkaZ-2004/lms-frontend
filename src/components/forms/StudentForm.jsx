import React, { useState } from 'react';
import { Save, X, User, Mail, IdCard } from 'lucide-react';

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

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Registration Number validation
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
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);

            // Handle specific error messages from backend
            if (error.response?.data?.message) {
                if (error.response.data.message.includes('Email already exists')) {
                    setErrors({ email: 'This email is already registered' });
                } else {
                    setErrors({ submit: error.response.data.message });
                }
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
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        <p className="text-sm">{errors.submit}</p>
                    </div>
                )}

                {/* Full Name Field */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Full Name *</span>
                        </div>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        placeholder="Enter student's full name"
                        disabled={loading}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {errors.fullName}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email Address *</span>
                        </div>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        placeholder="Enter email address"
                        disabled={loading}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Registration Number Field */}
                <div>
                    <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                            <IdCard className="w-4 h-4" />
                            <span>Registration Number *</span>
                        </div>
                    </label>
                    <input
                        type="text"
                        id="registrationNo"
                        name="registrationNo"
                        value={formData.registrationNo}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.registrationNo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        placeholder="Enter registration number (e.g., ST001)"
                        disabled={loading}
                    />
                    {errors.registrationNo && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {errors.registrationNo}
                        </p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2 transition-colors disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;