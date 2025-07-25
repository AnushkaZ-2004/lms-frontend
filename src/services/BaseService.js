import axios from 'axios';

class BaseService {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor for auth token
        this.api.interceptors.request.use((config) => {
            const user = JSON.parse(localStorage.getItem('lms_user'));
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
            return config;
        });

        // Add response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('lms_user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    get = (url, params) => this.api.get(url, { params });
    post = (url, data) => this.api.post(url, data);
    put = (url, data) => this.api.put(url, data);
    delete = (url) => this.api.delete(url);
}

export default BaseService;