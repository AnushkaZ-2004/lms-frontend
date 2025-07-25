import BaseService from './BaseService';

class CourseService extends BaseService {
    constructor() {
        super('http://localhost:8084/api');
    }

    getCourses = () => this.get('/courses');

    getCourse = (id) => this.get(`/courses/${id}`);

    createCourse = (data) => this.post('/courses', data);

    updateCourse = (id, data) => this.put(`/courses/${id}`, data);

    deleteCourse = (id) => this.delete(`/courses/${id}`);
}

export default new CourseService();