import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, Clock, Eye, Star } from 'lucide-react';
import { submissionService } from '../../services/submissionService';
import { assignmentService } from '../../services/assignmentService';
import { studentService } from '../../services/studentService';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SubmissionReview = () => {
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showGradingModal, setShowGradingModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const fetchSubmissions = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await submissionService.getAllSubmissions(page, 10, search);
            setSubmissions(response.content || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await assignmentService.getAllAssignments(0, 100);
            setAssignments(response.content || []);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await studentService.getAllStudents(0, 100);
            setStudents(response.content || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        fetchSubmissions();
        fetchAssignments();
        fetchStudents();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSubmissions(0, searchTerm);
    };

    const getAssignmentTitle = (assignmentId) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        return assignment ? assignment.title : 'Unknown Assignment';
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.fullName : 'Unknown Student';
    };

    const getStudentEmail = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.email : '';
    };

    const handleGrade = (submission) => {
        setSelectedSubmission(submission);
        setShowGradingModal(true);
    };

    const GradingForm = ({ submission, onSubmit, onCancel }) => {
        const [formData, setFormData] = useState({
            marks: submission?.marks || '',
            feedback: submission?.feedback || ''
        });
        const [errors, setErrors] = useState({});

        const validateForm = () => {
            const newErrors = {};
            if (!formData.marks || formData.marks < 0 || formData.marks > 100) {
                newErrors.marks = 'Please enter marks between 0 and 100';
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            try {
                await onSubmit({
                    marks: parseInt(formData.marks),
                    feedback: formData.feedback
                });
            } catch (error) {
                console.error('Error submitting grades:', error);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Student:</strong> {getStudentName(submission.studentId)}</p>
                        <p><strong>Assignment:</strong> {getAssignmentTitle(submission.assignmentId)}</p>
                        <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                        <p><strong>Description:</strong> {submission.description}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marks (0-100) *</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.marks}
                        onChange={(e) => setFormData(prev => ({ ...prev, marks: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.marks ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter marks"
                    />
                    {errors.marks && <p className="text-red-500 text-xs mt-1">{errors.marks}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                    <textarea
                        value={formData.feedback}
                        onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter feedback for the student"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center space-x-2"
                    >
                        <Star className="w-4 h-4" />
                        <span>Save Grade</span>
                    </button>
                </div>
            </form>
        );
    };

    const handleGradingSubmit = async (gradeData) => {
        try {
            await submissionService.updateMarks(selectedSubmission.id, gradeData.marks, gradeData.feedback);
            setShowGradingModal(false);
            setSelectedSubmission(null);
            fetchSubmissions(currentPage, searchTerm);
        } catch (error) {
            console.error('Error updating grades:', error);
        }
    };

    const filteredSubmissions = submissions.filter(submission => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'pending') return submission.marks === null;
        if (filterStatus === 'graded') return submission.marks !== null;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Submission Review</h1>
                <div className="text-sm text-gray-500">
                    Total submissions: {submissions.length}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search submissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    >
                        Search
                    </button>
                </form>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    <option value="all">All Submissions</option>
                    <option value="pending">Pending Review</option>
                    <option value="graded">Graded</option>
                </select>
            </div>

            {/* Submissions List */}
            {loading ? (
                <LoadingSpinner size="lg" text="Loading submissions..." />
            ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-12">
                    <Eye className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
                    <p className="mt-1 text-sm text-gray-500">No submissions match your current filters.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assignment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Marks
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSubmissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {getStudentName(submission.studentId)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {getStudentEmail(submission.studentId)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{getAssignmentTitle(submission.assignmentId)}</div>
                                            <div className="text-sm text-gray-500 max-w-xs truncate">{submission.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(submission.submittedAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {submission.marks !== null ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Graded
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {submission.marks !== null ? `${submission.marks}/100` : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {submission.fileUrl && (
                                                    <button
                                                        onClick={() => window.open(submission.fileUrl, '_blank')}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Download File"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleGrade(submission)}
                                                    className="text-primary-600 hover:text-primary-900 p-1"
                                                    title="Grade Submission"
                                                >
                                                    <Star className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => fetchSubmissions(currentPage - 1, searchTerm)}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchSubmissions(currentPage + 1, searchTerm)}
                                    disabled={currentPage >= totalPages - 1}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                                        <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => fetchSubmissions(i, searchTerm)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === currentPage
                                                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${i === 0 ? 'rounded-l-md' : ''} ${i === totalPages - 1 ? 'rounded-r-md' : ''
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Grading Modal */}
            <Modal
                isOpen={showGradingModal}
                onClose={() => {
                    setShowGradingModal(false);
                    setSelectedSubmission(null);
                }}
                title="Grade Submission"
                size="lg"
            >
                {selectedSubmission && (
                    <GradingForm
                        submission={selectedSubmission}
                        onSubmit={handleGradingSubmit}
                        onCancel={() => {
                            setShowGradingModal(false);
                            setSelectedSubmission(null);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default SubmissionReview;