import { apiInstances } from './api';

export const submissionService = {
    getAllSubmissions: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.submissions.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createSubmission: async (submissionData) => {
        const response = await apiInstances.submissions.post('/', submissionData);
        return response.data;
    },

    updateSubmission: async (id, submissionData) => {
        const response = await apiInstances.submissions.put(`/${id}`, submissionData);
        return response.data;
    },

    deleteSubmission: async (id) => {
        const response = await apiInstances.submissions.delete(`/${id}`);
        return response.data;
    },

    getSubmissionById: async (id) => {
        const response = await apiInstances.submissions.get(`/${id}`);
        return response.data;
    },

    getSubmissionsByAssignment: async (assignmentId) => {
        const response = await apiInstances.submissions.get(`/assignment/${assignmentId}`);
        return response.data;
    },

    getSubmissionsByStudent: async (studentId) => {
        const response = await apiInstances.submissions.get(`/student/${studentId}`);
        return response.data;
    },

    updateMarks: async (id, marks, feedback) => {
        const response = await apiInstances.submissions.put(`/${id}/marks`, { marks, feedback });
        return response.data;
    },

    getPendingSubmissions: async () => {
        const response = await apiInstances.submissions.get('/pending');
        return response.data;
    },

    getGradedSubmissions: async () => {
        const response = await apiInstances.submissions.get('/graded');
        return response.data;
    },

    uploadFile: async (file, submissionId) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiInstances.submissions.post(`/${submissionId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};