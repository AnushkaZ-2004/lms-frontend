import { apiInstances } from './api';

export const studentService = {
    getAllStudents: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.students.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createStudent: async (studentData) => {
        const response = await apiInstances.students.post('/', studentData);
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        const response = await apiInstances.students.put(`/${id}`, studentData);
        return response.data;
    },

    deleteStudent: async (id) => {
        const response = await apiInstances.students.delete(`/${id}`);
        return response.data;
    },

    getStudentById: async (id) => {
        const response = await apiInstances.students.get(`/${id}`);
        return response.data;
    },

    // Health check
    checkHealth: async () => {
        try {
            const response = await apiInstances.students.get('/health');
            return response.data;
        } catch (error) {
            return { status: 'DOWN', error: error.message };
        }
    }
};