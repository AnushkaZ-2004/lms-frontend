import BaseService from './BaseService';

class StudentService extends BaseService {
    constructor() {
        super('http://localhost:8082/api');
    }

    getStudents = () => this.get('/students');

    getStudent = (id) => this.get(`/students/${id}`);

    createStudent = (data) => this.post('/students', data);

    updateStudent = (id, data) => this.put(`/students/${id}`, data);

    deleteStudent = (id) => this.delete(`/students/${id}`);
}

export default new StudentService();