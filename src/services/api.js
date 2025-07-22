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

// Create axios instance with common config
const createApiInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add auth token to requests
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
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