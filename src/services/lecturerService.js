import { apiInstances } from './api';

export const lecturerService = {
    getAllLecturers: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.lecturers.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createLecturer: async (lecturerData) => {
        const response = await apiInstances.lecturers.post('/', lecturerData);
        return response.data;
    },

    updateLecturer: async (id, lecturerData) => {
        const response = await apiInstances.lecturers.put(`/${id}`, lecturerData);
        return response.data;
    },

    deleteLecturer: async (id) => {
        const response = await apiInstances.lecturers.delete(`/${id}`);
        return response.data;
    },

    getLecturerById: async (id) => {
        const response = await apiInstances.lecturers.get(`/${id}`);
        return response.data;
    },

    getLecturersByDepartment: async (department) => {
        const response = await apiInstances.lecturers.get(`/department/${department}`);
        return response.data;
    }
};