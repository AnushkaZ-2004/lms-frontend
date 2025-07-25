import axios from 'axios';

const API_BASE_URLS = {
    AUTH: 'http://localhost:8081/api/auth',
    STUDENTS: 'http://localhost:8082/api/students',
    LECTURERS: 'http://localhost:8083/api/lecturers',
    COURSES: 'http://localhost:8084/api/courses',
    ASSIGNMENTS: 'http://localhost:8085/api/assignments',
    SUBMISSIONS: 'http://localhost:8086/api/submissions',
    ANNOUNCEMENTS: 'http://localhost:8087/api/announcements',
    QUIZZES: 'http://localhost:8088/api/quizzes',
    MATERIALS: 'http://localhost:8089/api/materials'
};

const createApiInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        },
        (error) => {
            console.error('❌ Request error:', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => {
            console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
            return response;
        },
        (error) => {
            console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);

            if (error.response?.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export const apiInstances = {
    auth: createApiInstance(API_BASE_URLS.AUTH),
    students: createApiInstance(API_BASE_URLS.STUDENTS),
    lecturers: createApiInstance(API_BASE_URLS.LECTURERS),
    courses: createApiInstance(API_BASE_URLS.COURSES),
    assignments: createApiInstance(API_BASE_URLS.ASSIGNMENTS),
    submissions: createApiInstance(API_BASE_URLS.SUBMISSIONS),
    announcements: createApiInstance(API_BASE_URLS.ANNOUNCEMENTS),
    quizzes: createApiInstance(API_BASE_URLS.QUIZZES),
    materials: createApiInstance(API_BASE_URLS.MATERIALS)
};