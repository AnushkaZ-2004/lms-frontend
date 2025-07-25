import BaseService from './BaseService';

class AuthService extends BaseService {
    constructor() {
        super('http://localhost:8081/api');
    }

    login = (email, password) => this.post('/auth/login', { email, password });

    logout = () => this.post('/auth/logout');

    checkAuth = () => this.get('/auth/check');
}

export default new AuthService();