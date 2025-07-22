import { apiInstances } from './api';

export const assignmentService = {
    getAllAssignments: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.assignments.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createAssignment: async (assignmentData) => {
        const response = await apiInstances.assignments.post('/', assignmentData);
        return response.data;
    },

    updateAssignment: async (id, assignmentData) => {
        const response = await apiInstances.assignments.put(`/${id}`, assignmentData);
        return response.data;
    },

    deleteAssignment: async (id) => {
        const response = await apiInstances.assignments.delete(`/${id}`);
        return response.data;
    },

    getAssignmentById: async (id) => {
        const response = await apiInstances.assignments.get(`/${id}`);
        return response.data;
    },

    getAssignmentsByCourse: async (courseId) => {
        const response = await apiInstances.assignments.get(`/course/${courseId}`);
        return response.data;
    },

    getUpcomingAssignments: async () => {
        const response = await apiInstances.assignments.get('/upcoming');
        return response.data;
    },

    getOverdueAssignments: async () => {
        const response = await apiInstances.assignments.get('/overdue');
        return response.data;
    }
};