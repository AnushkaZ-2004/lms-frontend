import { apiInstances } from './api';

export const quizService = {
    // Quiz CRUD operations
    getAllQuizzes: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.quizzes.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createQuiz: async (quizData) => {
        const response = await apiInstances.quizzes.post('/', quizData);
        return response.data;
    },

    updateQuiz: async (id, quizData) => {
        const response = await apiInstances.quizzes.put(`/${id}`, quizData);
        return response.data;
    },

    deleteQuiz: async (id) => {
        const response = await apiInstances.quizzes.delete(`/${id}`);
        return response.data;
    },

    getQuizById: async (id) => {
        const response = await apiInstances.quizzes.get(`/${id}`);
        return response.data;
    },

    getQuizzesByCourse: async (courseId) => {
        const response = await apiInstances.quizzes.get(`/course/${courseId}`);
        return response.data;
    },

    // Question CRUD operations
    getQuestionsByQuiz: async (quizId) => {
        const response = await apiInstances.quizzes.get(`/${quizId}/questions`);
        return response.data;
    },

    createQuestion: async (quizId, questionData) => {
        const response = await apiInstances.quizzes.post(`/${quizId}/questions`, questionData);
        return response.data;
    },

    updateQuestion: async (questionId, questionData) => {
        const response = await apiInstances.quizzes.put(`/questions/${questionId}`, questionData);
        return response.data;
    },

    deleteQuestion: async (questionId) => {
        const response = await apiInstances.quizzes.delete(`/questions/${questionId}`);
        return response.data;
    },

    // Attempt operations
    getAllAttempts: async (page = 0, size = 10) => {
        const response = await apiInstances.quizzes.get(`/attempts?page=${page}&size=${size}`);
        return response.data;
    },

    getAttemptsByQuiz: async (quizId) => {
        const response = await apiInstances.quizzes.get(`/${quizId}/attempts`);
        return response.data;
    },

    getAttemptsByStudent: async (studentId) => {
        const response = await apiInstances.quizzes.get(`/attempts/student/${studentId}`);
        return response.data;
    },

    createAttempt: async (attemptData) => {
        const response = await apiInstances.quizzes.post('/attempts', attemptData);
        return response.data;
    },

    submitQuizAttempt: async (quizId, studentId, answers) => {
        const response = await apiInstances.quizzes.post(`/${quizId}/submit`, {
            studentId,
            answers
        });
        return response.data;
    },

    getQuizStatistics: async (quizId) => {
        const response = await apiInstances.quizzes.get(`/${quizId}/statistics`);
        return response.data;
    }
};