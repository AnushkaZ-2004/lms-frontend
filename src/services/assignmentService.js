import BaseService from './BaseService';

class AssignmentService extends BaseService {
    constructor() {
        super('http://localhost:8085/api');
    }

    getAssignments = () => this.get('/assignments');

    getAssignment = (id) => this.get(`/assignments/${id}`);

    createAssignment = (data) => this.post('/assignments', data);

    updateAssignment = (id, data) => this.put(`/assignments/${id}`, data);

    deleteAssignment = (id) => this.delete(`/assignments/${id}`);
}

export default new AssignmentService();