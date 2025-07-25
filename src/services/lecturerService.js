import BaseService from './BaseService';

class LecturerService extends BaseService {
    constructor() {
        super('http://localhost:8083/api');
    }

    getLecturers = () => this.get('/lecturers');

    getLecturer = (id) => this.get(`/lecturers/${id}`);

    createLecturer = (data) => this.post('/lecturers', data);

    updateLecturer = (id, data) => this.put(`/lecturers/${id}`, data);

    deleteLecturer = (id) => this.delete(`/lecturers/${id}`);
}

export default new LecturerService();