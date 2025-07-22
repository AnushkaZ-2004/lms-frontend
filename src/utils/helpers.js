import { format, parseISO } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export const formatDateTime = (dateTime) => {
    return formatDate(dateTime, 'MMM dd, yyyy HH:mm');
};

export const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    return due < today;
};

export const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const calculateGrade = (score, totalScore) => {
    if (!score || !totalScore) return 'N/A';
    const percentage = (score / totalScore) * 100;

    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    return 'F';
};

export const getGradeColor = (grade) => {
    const colors = {
        'A+': 'text-green-600',
        'A': 'text-green-600',
        'A-': 'text-green-500',
        'B+': 'text-blue-600',
        'B': 'text-blue-600',
        'B-': 'text-blue-500',
        'C+': 'text-yellow-600',
        'C': 'text-yellow-600',
        'C-': 'text-yellow-500',
        'F': 'text-red-600',
        'N/A': 'text-gray-500'
    };
    return colors[grade] || 'text-gray-500';
};

export const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateRandomColor = () => {
    const colors = [
        '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
        '#EF4444', '#06B6D4', '#84CC16', '#F97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};