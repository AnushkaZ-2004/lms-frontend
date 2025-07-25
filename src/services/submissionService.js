import BaseService from './BaseService';

class SubmissionService extends BaseService {
    constructor() {
        super('http://localhost:8086/api');
    }

    getSubmissions = () => this.get('/submissions');

    getSubmission = (id) => this.get(`/submissions/${id}`);

    reviewSubmission = (id, data) => this.put(`/submissions/${id}/review`, data);
}

export default new SubmissionService();