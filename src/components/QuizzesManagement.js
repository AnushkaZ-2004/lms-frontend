import React, { useState, useEffect } from 'react';

function QuizzesManagement({ api }) {
    const [activeSection, setActiveSection] = useState('quizzes'); // 'quizzes', 'questions', 'attempts'
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Quiz Management State
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [quizFormData, setQuizFormData] = useState({
        title: '',
        courseId: ''
    });

    // Question Management State
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [questionFormData, setQuestionFormData] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: ''
    });

    // Filters and Search
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (activeSection === 'quizzes') {
            loadQuizzes();
        } else if (activeSection === 'attempts') {
            loadAttempts();
        }
    }, [activeSection, selectedCourse, selectedStudent]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [coursesData, studentsData] = await Promise.all([
                api.getCourses(),
                api.getStudents(0, 1000)
            ]);
            setCourses(coursesData || []);
            setStudents(studentsData.content || studentsData || []);
            await loadQuizzes();
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
        setLoading(false);
    };

    const loadQuizzes = async () => {
        try {
            let quizzesData;
            if (selectedCourse) {
                quizzesData = await api.getQuizzesByCourse(selectedCourse);
            } else {
                quizzesData = await api.getAllQuizzes();
            }
            setQuizzes(quizzesData || []);
        } catch (error) {
            console.error('Error loading quizzes:', error);
            setQuizzes([]);
        }
    };

    const loadQuestions = async (quizId) => {
        try {
            const data = await api.getQuestions(quizId);
            setQuestions(data || []);
        } catch (error) {
            console.error('Error loading questions:', error);
            setQuestions([]);
        }
    };

    const loadAttempts = async () => {
        try {
            let attemptsData;
            if (selectedStudent) {
                attemptsData = await api.getAttemptsByStudent(selectedStudent);
            } else {
                attemptsData = await api.getAllAttempts();
            }
            setAttempts(attemptsData || []);
        } catch (error) {
            console.error('Error loading attempts:', error);
            setAttempts([]);
        }
    };

    // Quiz Management Functions
    const handleQuizSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            if (editingQuiz) {
                await api.updateQuiz(editingQuiz.id, quizFormData);
            } else {
                await api.createQuiz(quizFormData);
            }
            setShowQuizModal(false);
            setEditingQuiz(null);
            setQuizFormData({ title: '', courseId: '' });
            loadQuizzes();
        } catch (error) {
            alert('Error saving quiz: ' + error.message);
        }
    };

    const handleEditQuiz = (quiz) => {
        setEditingQuiz(quiz);
        setQuizFormData({
            title: quiz.title,
            courseId: quiz.courseId
        });
        setShowQuizModal(true);
    };

    const handleDeleteQuiz = async (id) => {
        if (window.confirm('Are you sure you want to delete this quiz? This will also delete all questions and attempts.')) {
            try {
                await api.deleteQuiz(id);
                loadQuizzes();
            } catch (error) {
                alert('Error deleting quiz: ' + error.message);
            }
        }
    };

    // Question Management Functions
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

    const handleManageQuestions = (quiz) => {
        setSelectedQuiz(quiz);
        setActiveSection('questions');
        loadQuestions(quiz.id);
    };

    const handleDeleteQuestion = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await api.deleteQuestion(id);
                loadQuestions(selectedQuiz.id);
            } catch (error) {
                alert('Error deleting question: ' + error.message);
            }
        }
    };

    // Helper Functions
    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.fullName : 'Unknown Student';
    };

    const getQuizName = (quizId) => {
        const quiz = quizzes.find(q => q.id === quizId);
        return quiz ? quiz.title : 'Unknown Quiz';
    };

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAttempts = attempts.filter(attempt => {
        const quizName = getQuizName(attempt.quizId).toLowerCase();
        const studentName = getStudentName(attempt.studentId).toLowerCase();
        return quizName.includes(searchTerm.toLowerCase()) ||
            studentName.includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return <div className="loading">Loading quiz management...</div>;
    }

    return (
        <div className="quiz-management">
            {/* Header */}

            {/* Navigation Tabs */}
            <div className="quiz-tabs">
                <button
                    className={`tab-btn ${activeSection === 'quizzes' ? 'active' : ''}`}
                    onClick={() => setActiveSection('quizzes')}
                >
                    <span className="tab-icon">📝</span>
                    <span>Manage Quizzes</span>
                    <span className="tab-badge">{quizzes.length}</span>
                </button>
                <button
                    className={`tab-btn ${activeSection === 'questions' ? 'active' : ''}`}
                    onClick={() => setActiveSection('questions')}
                    disabled={!selectedQuiz}
                >
                    <span className="tab-icon">❓</span>
                    <span>Manage Questions</span>
                    <span className="tab-badge">{questions.length}</span>
                </button>
                <button
                    className={`tab-btn ${activeSection === 'attempts' ? 'active' : ''}`}
                    onClick={() => setActiveSection('attempts')}
                >
                    <span className="tab-icon">📊</span>
                    <span>View Attempts</span>
                    <span className="tab-badge">{attempts.length}</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="quiz-filters">
                <div className="filter-group">
                    <label>Filter by Course:</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">All Courses</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.code} - {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                {activeSection === 'attempts' && (
                    <div className="filter-group">
                        <label>Filter by Student:</label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                        >
                            <option value="">All Students</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="filter-group search-group">
                    <label>Search:</label>
                    <input
                        type="text"
                        placeholder={`Search ${activeSection}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content based on active section */}
            {activeSection === 'quizzes' && (
                <div className="quiz-section">
                    <div className="section-header">
                        <h2>Manage Quizzes</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingQuiz(null);
                                setQuizFormData({ title: '', courseId: '' });
                                setShowQuizModal(true);
                            }}
                        >
                            Add New Quiz
                        </button>
                    </div>

                    <div className="quiz-grid">
                        {filteredQuizzes.length > 0 ? (
                            filteredQuizzes.map(quiz => (
                                <div key={quiz.id} className="quiz-card">
                                    <div className="quiz-card-header">
                                        <h3>{quiz.title}</h3>
                                        <div className="quiz-actions">
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleEditQuiz(quiz)}
                                                title="Edit Quiz"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteQuiz(quiz.id)}
                                                title="Delete Quiz"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div className="quiz-card-content">
                                        <div className="quiz-info">
                                            <span className="info-label">Course:</span>
                                            <span className="info-value">{getCourseName(quiz.courseId)}</span>
                                        </div>
                                        <div className="quiz-stats">
                                            <div className="stat-item">
                                                <span className="stat-value">{questions.filter(q => q.quizId === quiz.id).length}</span>
                                                <span className="stat-label">Questions</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-value">{attempts.filter(a => a.quizId === quiz.id).length}</span>
                                                <span className="stat-label">Attempts</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="quiz-card-footer">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleManageQuestions(quiz)}
                                        >
                                            Manage Questions
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <h3>No Quizzes Found</h3>
                                <p>Create your first quiz to get started</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowQuizModal(true)}
                                >
                                    Create Quiz
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeSection === 'questions' && selectedQuiz && (
                <div className="questions-section">
                    <div className="section-header">
                        <div className="section-title">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setActiveSection('quizzes');
                                    setSelectedQuiz(null);
                                }}
                            >
                                ← Back to Quizzes
                            </button>
                            <div>
                                <h2>Questions for: {selectedQuiz.title}</h2>
                                <p>Course: {getCourseName(selectedQuiz.courseId)}</p>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowQuestionModal(true)}
                        >
                            ➕ Add Question
                        </button>
                    </div>

                    <div className="questions-list">
                        {questions.length > 0 ? (
                            questions.map((question, index) => (
                                <div key={question.id} className="question-card">
                                    <div className="question-header">
                                        <span className="question-number">Q{index + 1}</span>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                            title="Delete Question"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div className="question-content">
                                        <h4>{question.questionText}</h4>
                                        <div className="options-grid">
                                            <div className={`option ${question.correctAnswer === 'A' ? 'correct' : ''}`}>
                                                <span className="option-label">A)</span>
                                                <span>{question.optionA}</span>
                                                {question.correctAnswer === 'A' && <span className="correct-indicator">✓</span>}
                                            </div>
                                            <div className={`option ${question.correctAnswer === 'B' ? 'correct' : ''}`}>
                                                <span className="option-label">B)</span>
                                                <span>{question.optionB}</span>
                                                {question.correctAnswer === 'B' && <span className="correct-indicator">✓</span>}
                                            </div>
                                            <div className={`option ${question.correctAnswer === 'C' ? 'correct' : ''}`}>
                                                <span className="option-label">C)</span>
                                                <span>{question.optionC}</span>
                                                {question.correctAnswer === 'C' && <span className="correct-indicator">✓</span>}
                                            </div>
                                            <div className={`option ${question.correctAnswer === 'D' ? 'correct' : ''}`}>
                                                <span className="option-label">D)</span>
                                                <span>{question.optionD}</span>
                                                {question.correctAnswer === 'D' && <span className="correct-indicator">✓</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">❓</div>
                                <h3>No Questions Added</h3>
                                <p>Add questions to make this quiz available for students</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowQuestionModal(true)}
                                >
                                    Add First Question
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeSection === 'attempts' && (
                <div className="attempts-section">
                    <div className="section-header">
                        <h2>Student Attempts</h2>
                        <div className="attempts-stats">
                            <div className="stat-card">
                                <span className="stat-value">{attempts.length}</span>
                                <span className="stat-label">Total Attempts</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">
                                    {attempts.length > 0 ? Math.round(attempts.reduce((sum, att) => sum + att.score, 0) / attempts.length) : 0}%
                                </span>
                                <span className="stat-label">Average Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="attempts-table">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Quiz</th>
                                    <th>Course</th>
                                    <th>Score</th>
                                    <th>Correct Answers</th>
                                    <th>Total Questions</th>
                                    <th>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttempts.length > 0 ? (
                                    filteredAttempts.map(attempt => {
                                        const quiz = quizzes.find(q => q.id === attempt.quizId);
                                        return (
                                            <tr key={attempt.id}>
                                                <td>{getStudentName(attempt.studentId)}</td>
                                                <td>{getQuizName(attempt.quizId)}</td>
                                                <td>{quiz ? getCourseName(quiz.courseId) : 'N/A'}</td>
                                                <td>
                                                    <span className={`score-badge ${attempt.score >= 80 ? 'excellent' :
                                                        attempt.score >= 60 ? 'good' :
                                                            attempt.score >= 40 ? 'average' : 'poor'
                                                        }`}>
                                                        {attempt.score}%
                                                    </span>
                                                </td>
                                                <td>{attempt.correctAnswers}</td>
                                                <td>{attempt.totalQuestions}</td>
                                                <td>
                                                    <div className="performance-bar">
                                                        <div
                                                            className="performance-fill"
                                                            style={{
                                                                width: `${attempt.score}%`,
                                                                backgroundColor:
                                                                    attempt.score >= 80 ? '#10b981' :
                                                                        attempt.score >= 60 ? '#f59e0b' :
                                                                            attempt.score >= 40 ? '#3b82f6' : '#ef4444'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-data">
                                            No attempts found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quiz Creation/Edit Modal */}
            {showQuizModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h3>
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
                                    placeholder="Enter quiz title"
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
                                    {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Creation Modal */}
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
                                    placeholder="Enter your question..."
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="options-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Option A</label>
                                        <input
                                            type="text"
                                            value={questionFormData.optionA}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, optionA: e.target.value })}
                                            placeholder="Option A"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Option B</label>
                                        <input
                                            type="text"
                                            value={questionFormData.optionB}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, optionB: e.target.value })}
                                            placeholder="Option B"
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
                                            placeholder="Option C"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Option D</label>
                                        <input
                                            type="text"
                                            value={questionFormData.optionD}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, optionD: e.target.value })}
                                            placeholder="Option D"
                                            required
                                        />
                                    </div>
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
                                    <option value="A">A - {questionFormData.optionA || 'Option A'}</option>
                                    <option value="B">B - {questionFormData.optionB || 'Option B'}</option>
                                    <option value="C">C - {questionFormData.optionC || 'Option C'}</option>
                                    <option value="D">D - {questionFormData.optionD || 'Option D'}</option>
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

export default QuizzesManagement;