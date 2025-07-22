import { apiInstances } from './api';

export const courseService = {
    getAllCourses: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.courses.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await apiInstances.courses.post('/', courseData);
        return response.data;
    },

    updateCourse: async (id, courseData) => {
        const response = await apiInstances.courses.put(`/${id}`, courseData);
        return response.data;
    },

    deleteCourse: async (id) => {
        const response = await apiInstances.courses.delete(`/${id}`);
        return response.data;
    },

    getCourseById: async (id) => {
        const response = await apiInstances.courses.get(`/${id}`);
        return response.data;
    },

    getCoursesByLecturer: async (lecturerId) => {
        const response = await apiInstances.courses.get(`/lecturer/${lecturerId}`);
        return response.data;
    },

    getCoursesWithDetails: async () => {
        const response = await apiInstances.courses.get('/with-details');
        return response.data;
    }
};
