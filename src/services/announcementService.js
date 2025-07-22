import { apiInstances } from './api';

export const announcementService = {
    getAllAnnouncements: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.announcements.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createAnnouncement: async (announcementData) => {
        const response = await apiInstances.announcements.post('/', announcementData);
        return response.data;
    },

    updateAnnouncement: async (id, announcementData) => {
        const response = await apiInstances.announcements.put(`/${id}`, announcementData);
        return response.data;
    },

    deleteAnnouncement: async (id) => {
        const response = await apiInstances.announcements.delete(`/${id}`);
        return response.data;
    },

    getAnnouncementById: async (id) => {
        const response = await apiInstances.announcements.get(`/${id}`);
        return response.data;
    },

    getGlobalAnnouncements: async () => {
        const response = await apiInstances.announcements.get('/global');
        return response.data;
    },

    getAnnouncementsByCourse: async (courseId) => {
        const response = await apiInstances.announcements.get(`/course/${courseId}`);
        return response.data;
    },

    getAnnouncementsByRole: async (role) => {
        const response = await apiInstances.announcements.get(`/role/${role}`);
        return response.data;
    },

    getRecentAnnouncements: async (limit = 5) => {
        const response = await apiInstances.announcements.get(`/recent?limit=${limit}`);
        return response.data;
    },

    markAsRead: async (id, userId) => {
        const response = await apiInstances.announcements.post(`/${id}/read`, { userId });
        return response.data;
    }
};