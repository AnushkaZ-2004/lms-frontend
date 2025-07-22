export const USER_ROLES = {
    ADMIN: 'ADMIN',
    STUDENT: 'STUDENT',
    LECTURER: 'LECTURER'
};

export const MATERIAL_TYPES = {
    PDF: 'PDF',
    VIDEO: 'VIDEO',
    AUDIO: 'AUDIO',
    IMAGE: 'IMAGE',
    DOCUMENT: 'DOCUMENT',
    LINK: 'LINK'
};

export const QUIZ_ANSWERS = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D'
};

export const ANNOUNCEMENT_TYPES = {
    GLOBAL: 'GLOBAL',
    COURSE: 'COURSE'
};

export const API_ENDPOINTS = {
    AUTH: '/api/auth',
    STUDENTS: '/api/students',
    LECTURERS: '/api/lecturers',
    COURSES: '/api/courses',
    ASSIGNMENTS: '/api/assignments',
    SUBMISSIONS: '/api/submissions',
    ANNOUNCEMENTS: '/api/announcements',
    QUIZZES: '/api/quizzes',
    MATERIALS: '/api/materials'
};

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

export const DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    INPUT: 'YYYY-MM-DD',
    DATETIME: 'MMM DD, YYYY HH:mm'
};