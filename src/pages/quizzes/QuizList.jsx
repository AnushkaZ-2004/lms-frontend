import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, HelpCircle, Play, BarChart3 } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { courseService } from '../../services/courseService';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);

    const fetchQuizzes = async (page = 0, search = '') => {
        try {
            setLoading(true);
            const response = await quizService.getAllQuizzes(page, 10, search);
            setQuizzes(response.content || []);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await courseService.getAllCourses(0, 100);
            setCourses(response.content || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchQuizzes(0, searchTerm);
    };

    const handleEdit = (quiz) => {
        setEditingQuiz(quiz);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await quizService.deleteQuiz(id);
                fetchQuizzes(currentPage, searchTerm);
            } catch (error) {
                console.error('Error deleting quiz:', error);
            }
        }
    };

    const handleViewQuestions = async (quiz) => {
        try {
            const questionsData = await quizService.getQuestionsByQuiz(quiz.id);
            setQuestions(questionsData);
            setSelectedQuiz(quiz);
            setShowQuestionsModal(true);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const QuizForm = ({ quiz, onSubmit, onCancel }) => {
        const [formData, setFormData] = useState({
            title: quiz?.title || '',
            courseId: quiz?.courseId || ''
        });
        const [errors, setErrors] = useState({});

        const validateForm = () => {
            const newErrors = {};
            if (!formData.title.trim()) newErrors.title = 'Quiz title is required';
            if (!formData.courseId) newErrors.courseId = 'Please select a course';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            try {
                await onSubmit({
                    ...formData,
                    courseId: parseInt(formData.courseId)
                });
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter quiz title"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                    <select
                        value={formData.courseId}
                        onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
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
                    {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>}
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
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                        Save Quiz
                    </button>
                </div>
            </form>
        );
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingQuiz) {
                await quizService.updateQuiz(editingQuiz.id, formData);
            } else {
                await quizService.createQuiz(formData);
            }
            setShowModal(false);
            setEditingQuiz(null);
            fetchQuizzes(currentPage, searchTerm);
        } catch (error) {
            console.error('Error saving quiz:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Quiz</span>
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex space-x-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
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

            {/* Quizzes Grid */}
            {loading ? (
                <LoadingSpinner size="lg" text="Loading quizzes..." />
            ) : quizzes.length === 0 ? (
                <div className="text-center py-12">
                    <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new quiz.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <HelpCircle className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                                        <p className="text-sm text-gray-600">{getCourseName(quiz.courseId)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleViewQuestions(quiz)}
                                    className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View Questions</span>
                                </button>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(quiz)}
                                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(quiz.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => fetchQuizzes(currentPage - 1, searchTerm)}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => fetchQuizzes(currentPage + 1, searchTerm)}
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
                                        onClick={() => fetchQuizzes(i, searchTerm)}
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

            {/* Modal for Add/Edit Quiz */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingQuiz(null);
                }}
                title={editingQuiz ? 'Edit Quiz' : 'Add New Quiz'}
            >
                <QuizForm
                    quiz={editingQuiz}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingQuiz(null);
                    }}
                />
            </Modal>

            {/* Questions Modal */}
            <Modal
                isOpen={showQuestionsModal}
                onClose={() => setShowQuestionsModal(false)}
                title={`Questions for: ${selectedQuiz?.title}`}
                size="lg"
            >
                <div className="space-y-4">
                    {questions.length === 0 ? (
                        <div className="text-center py-8">
                            <HelpCircle className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">No questions added yet</p>
                        </div>
                    ) : (
                        questions.map((question, index) => (
                            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="mb-3">
                                    <h4 className="font-medium text-gray-900">
                                        {index + 1}. {question.questionText}
                                    </h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className={`p-2 rounded ${question.correctAnswer === 'A' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                        A. {question.optionA}
                                    </div>
                                    <div className={`p-2 rounded ${question.correctAnswer === 'B' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                        B. {question.optionB}
                                    </div>
                                    <div className={`p-2 rounded ${question.correctAnswer === 'C' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                        C. {question.optionC}
                                    </div>
                                    <div className={`p-2 rounded ${question.correctAnswer === 'D' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                        D. {question.optionD}
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    Correct Answer: {question.correctAnswer}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default QuizList;