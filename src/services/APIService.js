// API Service for Client-Side Search (No backend search parameters)
class APIService {
    constructor() {
        this.baseURLs = {
            auth: 'http://localhost:8081',
            student: 'http://localhost:8082',
            lecturer: 'http://localhost:8083',
            course: 'http://localhost:8084',
            assignment: 'http://localhost:8085',
            submission: 'http://localhost:8086',
            announcement: 'http://localhost:8087',
            quiz: 'http://localhost:8088',
            material: 'http://localhost:8089'
        };
        this.token = localStorage.getItem('token');
    }

    async request(service, endpoint, options = {}) {
        const url = `${this.baseURLs[service]}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers
            },
            ...options
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');

        // If it's a DELETE request or empty response, don't try to parse JSON
        if (options.method === 'DELETE' ||
            contentLength === '0' ||
            response.status === 204 ||
            !contentType?.includes('application/json')) {
            return { success: true };
        }

        return response.json();
    }

    // Auth Service
    async login(email, password) {
        const result = await this.request('auth', '/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (result.token) {
            this.token = result.token;
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result;
    }

    async logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Student Service - No search parameter (client-side search)
    async getStudents(page = 0, size = 10) {
        // Build query parameters without search
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        const endpoint = `/api/students?${params.toString()}`;

        try {
            return await this.request('student', endpoint);
        } catch (error) {
            console.error('Error fetching students:', error);
            return {
                content: [],
                totalElements: 0,
                totalPages: 0,
                size: size,
                number: page
            };
        }
    }

    async createStudent(student) {
        return this.request('student', '/api/students', {
            method: 'POST',
            body: JSON.stringify(student)
        });
    }

    async updateStudent(id, student) {
        return this.request('student', `/api/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(student)
        });
    }

    async deleteStudent(id) {
        return this.request('student', `/api/students/${id}`, {
            method: 'DELETE'
        });
    }

    // Lecturer Service - No search parameter (client-side search)
    async getLecturers() {
        try {
            return await this.request('lecturer', '/api/lecturers');
        } catch (error) {
            console.error('Error fetching lecturers:', error);
            return [];
        }
    }

    async createLecturer(lecturer) {
        return this.request('lecturer', '/api/lecturers', {
            method: 'POST',
            body: JSON.stringify(lecturer)
        });
    }

    async updateLecturer(id, lecturer) {
        return this.request('lecturer', `/api/lecturers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lecturer)
        });
    }

    async deleteLecturer(id) {
        return this.request('lecturer', `/api/lecturers/${id}`, {
            method: 'DELETE'
        });
    }

    // Course Service
    async getCourses() {
        try {
            return await this.request('course', '/api/courses');
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }

    async createCourse(course) {
        return this.request('course', '/api/courses', {
            method: 'POST',
            body: JSON.stringify(course)
        });
    }

    async updateCourse(id, course) {
        return this.request('course', `/api/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(course)
        });
    }

    async deleteCourse(id) {
        return this.request('course', `/api/courses/${id}`, {
            method: 'DELETE'
        });
    }

    // Assignment Service
    async getAssignments(courseId = null) {
        const params = new URLSearchParams();

        if (courseId) {
            params.append('courseId', courseId.toString());
        }

        const endpoint = params.toString()
            ? `/api/assignments?${params.toString()}`
            : '/api/assignments';

        try {
            return await this.request('assignment', endpoint);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            return [];
        }
    }

    async createAssignment(assignment) {
        return this.request('assignment', '/api/assignments', {
            method: 'POST',
            body: JSON.stringify(assignment)
        });
    }

    async updateAssignment(id, assignment) {
        return this.request('assignment', `/api/assignments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(assignment)
        });
    }

    async deleteAssignment(id) {
        return this.request('assignment', `/api/assignments/${id}`, {
            method: 'DELETE'
        });
    }

    // Quiz Service
    async getQuizzes(courseId = null) {
        const params = new URLSearchParams();

        if (courseId) {
            params.append('courseId', courseId.toString());
        }

        const endpoint = params.toString()
            ? `/api/quizzes?${params.toString()}`
            : '/api/quizzes';

        try {
            return await this.request('quiz', endpoint);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            return [];
        }
    }

    async createQuiz(quiz) {
        return this.request('quiz', '/api/quizzes', {
            method: 'POST',
            body: JSON.stringify(quiz)
        });
    }

    async getQuestions(quizId) {
        try {
            return await this.request('quiz', `/api/questions?quizId=${quizId}`);
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }

    async createQuestion(question) {
        return this.request('quiz', '/api/questions', {
            method: 'POST',
            body: JSON.stringify(question)
        });
    }

    // Submission Service
    async getSubmissions(assignmentId = null) {
        const params = new URLSearchParams();

        if (assignmentId) {
            params.append('assignmentId', assignmentId.toString());
        }

        const endpoint = params.toString()
            ? `/api/submissions?${params.toString()}`
            : '/api/submissions';

        try {
            return await this.request('submission', endpoint);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            return [];
        }
    }

    async updateSubmission(id, marks, feedback) {
        return this.request('submission', `/api/submissions/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ marks, feedback })
        });
    }

    // Announcement Service
    async getAnnouncements() {
        try {
            return await this.request('announcement', '/api/announcements');
        } catch (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
    }

    async createAnnouncement(announcement) {
        return this.request('announcement', '/api/announcements', {
            method: 'POST',
            body: JSON.stringify(announcement)
        });
    }

    // Dashboard Stats with error handling
    async getDashboardStats() {
        try {
            const [students, lecturers, courses, submissions] = await Promise.all([
                this.getStudents(0, 1).catch(() => ({ totalElements: 0, content: [] })),
                this.getLecturers().catch(() => []),
                this.getCourses().catch(() => []),
                this.getSubmissions().catch(() => [])
            ]);

            return {
                totalStudents: students.totalElements || students.length || 0,
                totalLecturers: lecturers.length || 0,
                totalCourses: courses.length || 0,
                totalSubmissions: submissions.length || 0
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalStudents: 0,
                totalLecturers: 0,
                totalCourses: 0,
                totalSubmissions: 0
            };
        }
    }
}

export default APIService;