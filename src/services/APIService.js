// Enhanced API Service with Complete Quiz Management
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

    // Student Service
    async getStudents(page = 0, size = 10) {
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

    // Lecturer Service
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

    // ===== ENHANCED QUIZ SERVICE ===== //

    // Quiz Management
    async createQuiz(quiz) {
        try {
            return await this.request('quiz', '/api/quizzes', {
                method: 'POST',
                body: JSON.stringify(quiz)
            });
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw error;
        }
    }

    async getQuizzesByCourse(courseId) {
        try {
            return await this.request('quiz', `/api/quizzes/course/${courseId}`);
        } catch (error) {
            console.error('Error fetching quizzes by course:', error);
            return [];
        }
    }

    // Get all quizzes (you might need to add this endpoint to your backend)
    async getAllQuizzes() {
        try {
            // If your backend doesn't have a general endpoint, we'll fetch by all courses
            const courses = await this.getCourses();
            const allQuizzes = [];

            for (const course of courses) {
                const courseQuizzes = await this.getQuizzesByCourse(course.id);
                allQuizzes.push(...courseQuizzes);
            }

            return allQuizzes;
        } catch (error) {
            console.error('Error fetching all quizzes:', error);
            return [];
        }
    }

    // Note: You might need to add these endpoints to your backend
    async updateQuiz(id, quiz) {
        try {
            return await this.request('quiz', `/api/quizzes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(quiz)
            });
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw error;
        }
    }

    async deleteQuiz(id) {
        try {
            return await this.request('quiz', `/api/quizzes/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw error;
        }
    }

    // Question Management
    async createQuestion(question) {
        try {
            return await this.request('quiz', '/api/quizzes/questions', {
                method: 'POST',
                body: JSON.stringify(question)
            });
        } catch (error) {
            console.error('Error creating question:', error);
            throw error;
        }
    }

    async getQuestions(quizId) {
        try {
            return await this.request('quiz', `/api/quizzes/${quizId}/questions`);
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }

    // Note: You might need to add this endpoint to your backend
    async deleteQuestion(id) {
        try {
            return await this.request('quiz', `/api/quizzes/questions/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting question:', error);
            throw error;
        }
    }

    // Attempt Management
    async submitQuizAttempt(quizId, studentId, answers) {
        try {
            const submissionData = {
                quizId: quizId,
                studentId: studentId,
                answers: answers // Map<Long, String> - questionId -> answer
            };

            return await this.request('quiz', `/api/quizzes/${quizId}/submit/${studentId}`, {
                method: 'POST',
                body: JSON.stringify(submissionData)
            });
        } catch (error) {
            console.error('Error submitting quiz attempt:', error);
            throw error;
        }
    }

    async getAttemptsByStudent(studentId) {
        try {
            return await this.request('quiz', `/api/quizzes/attempts/${studentId}`);
        } catch (error) {
            console.error('Error fetching student attempts:', error);
            return [];
        }
    }

    // Get all attempts (you might need to add this endpoint to your backend)
    async getAllAttempts() {
        try {
            // If your backend doesn't have a general endpoint, we'll fetch by all students
            const students = await this.getStudents(0, 1000);
            const studentList = students.content || students || [];
            const allAttempts = [];

            for (const student of studentList) {
                const studentAttempts = await this.getAttemptsByStudent(student.id);
                allAttempts.push(...studentAttempts);
            }

            return allAttempts;
        } catch (error) {
            console.error('Error fetching all attempts:', error);
            return [];
        }
    }

    // Submission Service

    async getSubmissions(assignmentId = null) {
        let endpoint = '/api/submissions';

        if (assignmentId) {
            endpoint = `/api/submissions/assignment/${assignmentId}`;
        }

        try {
            return await this.request('submission', endpoint);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            return [];
        }
    }

    async getSubmissionById(id) {
        try {
            return await this.request('submission', `/api/submissions/${id}`);
        } catch (error) {
            console.error('Error fetching submission:', error);
            return null;
        }
    }

    async getSubmissionsByStudent(studentId) {
        try {
            return await this.request('submission', `/api/submissions/student/${studentId}`);
        } catch (error) {
            console.error('Error fetching student submissions:', error);
            return [];
        }
    }

    async getSubmissionsByAssignment(assignmentId) {
        try {
            return await this.request('submission', `/api/submissions/assignment/${assignmentId}`);
        } catch (error) {
            console.error('Error fetching assignment submissions:', error);
            return [];
        }
    }

    async createSubmission(submission) {
        try {
            // Ensure submittedAt is set if not provided
            if (!submission.submittedAt) {
                submission.submittedAt = new Date().toISOString();
            }

            return await this.request('submission', '/api/submissions', {
                method: 'POST',
                body: JSON.stringify(submission)
            });
        } catch (error) {
            console.error('Error creating submission:', error);
            throw error;
        }
    }

    async updateSubmission(id, marks, feedback) {
        try {
            return await this.request('submission', `/api/submissions/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ marks, feedback })
            });
        } catch (error) {
            console.error('Error updating submission:', error);
            throw error;
        }
    }

    // Alternative method using query parameters (if you prefer the /review endpoint)
    async reviewSubmission(id, marks, feedback) {
        try {
            const params = new URLSearchParams({
                marks: marks.toString(),
                feedback: feedback || ''
            });

            return await this.request('submission', `/api/submissions/${id}/review?${params.toString()}`, {
                method: 'PUT'
            });
        } catch (error) {
            console.error('Error reviewing submission:', error);
            throw error;
        }
    }

    async deleteSubmission(id) {
        try {
            return await this.request('submission', `/api/submissions/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting submission:', error);
            throw error;
        }
    }

    // Get pending submissions (not reviewed)
    async getPendingSubmissions() {
        try {
            const allSubmissions = await this.getSubmissions();
            return allSubmissions.filter(submission =>
                submission.marks === null || submission.marks === undefined
            );
        } catch (error) {
            console.error('Error fetching pending submissions:', error);
            return [];
        }
    }

    // Get reviewed submissions
    async getReviewedSubmissions() {
        try {
            const allSubmissions = await this.getSubmissions();
            return allSubmissions.filter(submission =>
                submission.marks !== null && submission.marks !== undefined
            );
        } catch (error) {
            console.error('Error fetching reviewed submissions:', error);
            return [];
        }
    }

    // Announcement Service

    // Announcement Service - FIXED TO MATCH YOUR BACKEND
    async getAnnouncements() {
        try {
            return await this.request('announcement', '/api/announcements');
        } catch (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
    }

    async getGlobalAnnouncements() {
        try {
            return await this.request('announcement', '/api/announcements/global');
        } catch (error) {
            console.error('Error fetching global announcements:', error);
            return [];
        }
    }

    async getCourseAnnouncements(courseId) {
        try {
            return await this.request('announcement', `/api/announcements/course/${courseId}`);
        } catch (error) {
            console.error('Error fetching course announcements:', error);
            return [];
        }
    }

    async createAnnouncement(announcement) {
        try {
            // Ensure courseId is properly formatted for your backend
            const formattedAnnouncement = {
                ...announcement,
                courseId: announcement.courseId || null, // Convert empty string to null
                title: announcement.title?.trim(),
                message: announcement.message?.trim()
            };

            console.log('Creating announcement:', formattedAnnouncement);

            return await this.request('announcement', '/api/announcements', {
                method: 'POST',
                body: JSON.stringify(formattedAnnouncement)
            });
        } catch (error) {
            console.error('Error creating announcement:', error);
            throw error;
        }
    }

    async deleteAnnouncement(id) {
        try {
            return await this.request('announcement', `/api/announcements/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting announcement:', error);
            throw error;
        }
    }


    // Dashboard Stats with enhanced quiz data
    async getDashboardStats() {
        try {
            const [students, lecturers, courses, submissions, quizzes, attempts] = await Promise.all([
                this.getStudents(0, 1).catch(() => ({ totalElements: 0, content: [] })),
                this.getLecturers().catch(() => []),
                this.getCourses().catch(() => []),
                this.getSubmissions().catch(() => []),
                this.getAllQuizzes().catch(() => []),
                this.getAllAttempts().catch(() => [])
            ]);

            return {
                totalStudents: students.totalElements || students.length || 0,
                totalLecturers: lecturers.length || 0,
                totalCourses: courses.length || 0,
                totalSubmissions: submissions.length || 0,
                totalQuizzes: quizzes.length || 0,
                totalAttempts: attempts.length || 0,
                averageQuizScore: attempts.length > 0
                    ? Math.round(attempts.reduce((sum, att) => sum + att.score, 0) / attempts.length)
                    : 0
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalStudents: 0,
                totalLecturers: 0,
                totalCourses: 0,
                totalSubmissions: 0,
                totalQuizzes: 0,
                totalAttempts: 0,
                averageQuizScore: 0
            };
        }
    }

    // Health Check Utility - Add this to your APIService.js

    // Add these methods to your APIService class for better health checking

    async checkServiceHealth(serviceName, port, endpoint = '/actuator/health') {
        try {
            const response = await fetch(`http://localhost:${port}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            return {
                service: serviceName,
                status: response.ok ? 'UP' : 'DOWN',
                statusCode: response.status,
                responseTime: response.headers.get('X-Response-Time') || 'N/A'
            };
        } catch (error) {
            return {
                service: serviceName,
                status: 'DOWN',
                error: error.message,
                statusCode: 0
            };
        }
    }

    async getAllServicesHealth() {
        const services = [
            { name: 'Auth Service', port: 8081 },
            { name: 'Student Service', port: 8082 },
            { name: 'Lecturer Service', port: 8083 },
            { name: 'Course Service', port: 8084 },
            { name: 'Assignment Service', port: 8085 },
            { name: 'Submission Service', port: 8086 },
            { name: 'Announcement Service', port: 8087 },
            { name: 'Quiz Service', port: 8088 },
            { name: 'Material Service', port: 8089 }
        ];

        const healthChecks = await Promise.all(
            services.map(service =>
                this.checkServiceHealth(service.name, service.port)
            )
        );

        return healthChecks;
    }

    // Get real-time system metrics
    async getSystemMetrics() {
        try {
            const [
                studentsData,
                lecturersData,
                coursesData,
                assignmentsData,
                submissionsData,
                announcementsData,
                quizzesData
            ] = await Promise.all([
                this.getStudents(0, 1).catch(() => ({ totalElements: 0 })),
                this.getLecturers().catch(() => []),
                this.getCourses().catch(() => []),
                this.getAssignments().catch(() => []),
                this.getSubmissions().catch(() => []),
                this.getAnnouncements().catch(() => []),
                this.getQuizzes().catch(() => [])
            ]);

            return {
                totalStudents: studentsData.totalElements || studentsData.length || 0,
                totalLecturers: lecturersData.length || 0,
                totalCourses: coursesData.length || 0,
                totalAssignments: assignmentsData.length || 0,
                totalSubmissions: submissionsData.length || 0,
                totalAnnouncements: announcementsData.length || 0,
                totalQuizzes: quizzesData.length || 0,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting system metrics:', error);
            return {
                totalStudents: 0,
                totalLecturers: 0,
                totalCourses: 0,
                totalAssignments: 0,
                totalSubmissions: 0,
                totalAnnouncements: 0,
                totalQuizzes: 0,
                error: error.message,
                lastUpdated: new Date().toISOString()
            };
        }
    }
}

export default APIService;