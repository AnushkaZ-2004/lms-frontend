import BaseService from './BaseService';

class MaterialService extends BaseService {
    constructor() {
        super('http://localhost:8089/api');
    }

    getMaterials = (courseId) => this.get('/materials', { courseId });

    uploadMaterial = (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        return this.api.post('/materials', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    deleteMaterial = (id) => this.delete(`/materials/${id}`);
}

export default new MaterialService();