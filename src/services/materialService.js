import { apiInstances } from './api';

export const materialService = {
    getAllMaterials: async (page = 0, size = 10, search = '') => {
        const response = await apiInstances.materials.get(`/?page=${page}&size=${size}&search=${search}`);
        return response.data;
    },

    createMaterial: async (materialData) => {
        const response = await apiInstances.materials.post('/', materialData);
        return response.data;
    },

    updateMaterial: async (id, materialData) => {
        const response = await apiInstances.materials.put(`/${id}`, materialData);
        return response.data;
    },

    deleteMaterial: async (id) => {
        const response = await apiInstances.materials.delete(`/${id}`);
        return response.data;
    },

    getMaterialById: async (id) => {
        const response = await apiInstances.materials.get(`/${id}`);
        return response.data;
    },

    getMaterialsByCourse: async (courseId) => {
        const response = await apiInstances.materials.get(`/course/${courseId}`);
        return response.data;
    },

    getMaterialsByType: async (type) => {
        const response = await apiInstances.materials.get(`/type/${type}`);
        return response.data;
    },

    getMaterialsByLecturer: async (lecturerId) => {
        const response = await apiInstances.materials.get(`/lecturer/${lecturerId}`);
        return response.data;
    },

    uploadMaterial: async (file, materialData) => {
        const formData = new FormData();
        formData.append('file', file);
        Object.keys(materialData).forEach(key => {
            formData.append(key, materialData[key]);
        });

        const response = await apiInstances.materials.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    downloadMaterial: async (id) => {
        const response = await apiInstances.materials.get(`/${id}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
};