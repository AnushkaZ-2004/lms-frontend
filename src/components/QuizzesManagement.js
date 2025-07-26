import React, { useState, useEffect } from 'react';

function QuizzesManagement({ api }) {
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [quizFormData, setQuizFormData] = useState({
        title: '',
        courseId: ''
    });
    const [questionFormData, setQuestionFormData] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [quizzesData, coursesData] = await Promise.all([
                api.getQuizzes(),
                api.getCourses()
            ]);
            setQuizzes(quizzesData || []);
            setCourses(coursesData || []);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    const handleQuizSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            await api.createQuiz(quizFormData);
            setShowQuizModal(false);
            setQuizFormData({ title: '', courseId: '' });
            loadData();
        } catch (error) {
            alert('Error creating quiz: ' + error.message);
        }
    };

    const handleQuestionSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            await api.createQuestion({
                ...questionFormData,
                quizId: selectedQuiz.id
            });
            setShowQuestionModal(false);
            setQuestionFormData({
                questionText: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                correctAnswer: ''
            });
            loadQuestions(selectedQuiz.id);
        } catch (error) {
            alert('Error adding question: ' + error.message);
        }
    };

    const loadQuestions = async (quizId) => {
        try {
            const data = await api.getQuestions(quizId);
            setQuestions(data || []);
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    if (selectedQuiz) {
        return (
            <div className="management-container">
                <div className="management-header">
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setSelectedQuiz(null);
                            setQuestions([]);
                        }}
                    >
                        ← Back to Quizzes
                    </button>
                    <h1>Manage Questions - {selectedQuiz.title}</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowQuestionModal(true)}
                    >
                        Add New Question
                    </button>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>Option A</th>
                                <th>Option B</th>
                                <th>Option C</th>
                                <th>Option D</th>
                                <th>Correct Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map(question => (
                                <tr key={question.id}>
                                    <td>{question.id}</td>
                                    <td>{question.questionText}</td>
                                    <td>{question.optionA}</td>
                                    <td>{question.optionB}</td>
                                    <td>{question.optionC}</td>
                                    <td>{question.optionD}</td>
                                    <td>{question.correctAnswer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showQuestionModal && (
                    <div className="modal-overlay">
                        <div className="modal large-modal">
                            <div className="modal-header">
                                <h3>Add New Question</h3>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowQuestionModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-form">
                                <div className="form-group">
                                    <label>Question Text</label>
                                    <textarea
                                        value={questionFormData.questionText}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, questionText: e.target.value })}
                                        required
                                        rows="3"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Option A</label>
                                        <input
                                            type="text"
                                            value={questionFormData.optionA}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, optionA: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Option B</label>
                                        <input
                                            type="text"
                                            value={questionFormData.optionB}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, optionB: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Option C</label>
                                        <input
                                            type="text"
                                            value={questionFormData.optionC}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, optionC: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Option D</label>
                                        <input
                                            type="text"
                                            value={questionFormData.optionD}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, optionD: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Correct Answer</label>
                                    <select
                                        value={questionFormData.correctAnswer}
                                        onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Correct Answer</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button onClick={() => setShowQuestionModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button onClick={handleQuestionSubmit} className="btn btn-primary">
                                        Add Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="management-container">
            <div className="management-header">
                <h1>Manage Quizzes</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowQuizModal(true)}
                >
                    Create New Quiz
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading quizzes...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Quiz Title</th>
                                <th>Course</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map(quiz => (
                                <tr key={quiz.id}>
                                    <td>{quiz.id}</td>
                                    <td>{quiz.title}</td>
                                    <td>{getCourseName(quiz.courseId)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => {
                                                setSelectedQuiz(quiz);
                                                loadQuestions(quiz.id);
                                            }}
                                        >
                                            Manage Questions
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showQuizModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Create New Quiz</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowQuizModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Quiz Title</label>
                                <input
                                    type="text"
                                    value={quizFormData.title}
                                    onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Course</label>
                                <select
                                    value={quizFormData.courseId}
                                    onChange={(e) => setQuizFormData({ ...quizFormData, courseId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} - {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => setShowQuizModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleQuizSubmit} className="btn btn-primary">
                                    Create Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizzesManagement;