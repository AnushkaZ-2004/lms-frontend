import React, { useState, useEffect } from 'react';

function StudentQuizzes({ api, user }) {
    const [quizzes, setQuizzes] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            const [quizzesData, attemptsData] = await Promise.all([
                api.getAllQuizzes(),
                api.getAttemptsByStudent(user.id)
            ]);
            setQuizzes(quizzesData);
            setAttempts(attemptsData);
        } catch (error) {
            console.error('Error loading quizzes:', error);
        }
        setLoading(false);
    };

    const startQuiz = async (quiz) => {
        try {
            const questionsData = await api.getQuestions(quiz.id);
            setActiveQuiz(quiz);
            setQuestions(questionsData);
            setAnswers({});
            setQuizStarted(true);
        } catch (error) {
            alert('Error starting quiz: ' + error.message);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
    };

    const submitQuiz = async () => {
        try {
            await api.submitQuizAttempt(activeQuiz.id, user.id, answers);
            setQuizStarted(false);
            setActiveQuiz(null);
            setQuestions([]);
            setAnswers({});
            loadQuizzes();
            alert('Quiz submitted successfully!');
        } catch (error) {
            alert('Error submitting quiz: ' + error.message);
        }
    };

    const getQuizAttempt = (quizId) => {
        return attempts.find(attempt => attempt.quizId === quizId);
    };

    if (loading) {
        return <div className="loading">Loading quizzes...</div>;
    }

    if (quizStarted && activeQuiz) {
        return (
            <div className="page-container">
                <div className="quiz-header">
                    <h1 className="page-title">🧪 {activeQuiz.title}</h1>
                    <p className="page-subtitle">Answer all questions and submit when complete</p>
                </div>

                <div className="quiz-content">
                    {questions.map((question, index) => (
                        <div key={question.id} className="question-card">
                            <div className="question-header">
                                <span className="question-number">Question {index + 1}</span>
                            </div>
                            <h3 className="question-text">{question.questionText}</h3>
                            <div className="options-container">
                                {['A', 'B', 'C', 'D'].map(option => (
                                    <label key={option} className="option-label">
                                        <input
                                            type="radio"
                                            name={`question_${question.id}`}
                                            value={option}
                                            checked={answers[question.id] === option}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className="radio-input"
                                        />
                                        <span className="option-text">
                                            {option}. {question[`option${option}`]}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="quiz-actions">
                    <button
                        className="secondary-button"
                        onClick={() => setQuizStarted(false)}
                    >
                        Exit Quiz
                    </button>
                    <button
                        className="primary-button"
                        onClick={submitQuiz}
                        disabled={Object.keys(answers).length !== questions.length}
                    >
                        Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">🧪 Available Quizzes</h1>
                <p className="page-subtitle">Take quizzes and view your results</p>
            </div>

            <div className="quizzes-grid">
                {quizzes.map(quiz => {
                    const attempt = getQuizAttempt(quiz.id);
                    return (
                        <div key={quiz.id} className="quiz-card">
                            <div className="quiz-card-header">
                                <h3 className="quiz-card-title">{quiz.title}</h3>
                                {attempt && (
                                    <div className="status-badge completed">
                                        ✅ Completed
                                    </div>
                                )}
                            </div>
                            <div className="quiz-card-content">
                                {attempt ? (
                                    <div className="attempt-results">
                                        <div className="score-display">
                                            <span className="score-label">Your Score:</span>
                                            <span className="score-value">{attempt.score}%</span>
                                        </div>
                                        <p className="attempt-details">
                                            Correct: {attempt.correctAnswers}/{attempt.totalQuestions}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="quiz-actions">
                                        <button
                                            className="primary-button"
                                            onClick={() => startQuiz(quiz)}
                                        >
                                            🚀 Start Quiz
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StudentQuizzes;