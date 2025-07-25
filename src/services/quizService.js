import BaseService from './BaseService';

class QuizService extends BaseService {
    constructor() {
        super('http://localhost:8088/api');
    }

    getQuizzes = () => this.get('/quizzes');

    getQuiz = (id) => this.get(`/quizzes/${id}`);

    createQuiz = (data) => this.post('/quizzes', data);

    updateQuiz = (id, data) => this.put(`/quizzes/${id}`, data);

    deleteQuiz = (id) => this.delete(`/quizzes/${id}`);

    getQuestions = (quizId) => this.get(`/quizzes/${quizId}/questions`);

    createQuestion = (quizId, data) => this.post(`/quizzes/${quizId}/questions`, data);

    updateQuestion = (quizId, questionId, data) => this.put(`/quizzes/${quizId}/questions/${questionId}`, data);

    deleteQuestion = (quizId, questionId) => this.delete(`/quizzes/${quizId}/questions/${questionId}`);
}

export default new QuizService();