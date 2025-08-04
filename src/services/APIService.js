// Updated API Service to match your backend
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
    }

    async request(service, endpoint, options = {}) {
        const url = `${this.baseURLs[service]}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', // Important for session cookies
            ...options
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

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

    // Auth Service - Updated to match your backend
    async login(email, password) {
        try {
            const result = await this.request('auth', '/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (result.success && result.user) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('isAuthenticated', 'true');
                return result;
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(fullName, email, password, role) {
        try {
            const result = await this.request('auth', '/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ fullName, email, password, role })
            });
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const result = await this.request('auth', '/api/auth/me');
            return result;
        } catch (error) {
            console.error('Get current user error:', error);
            // If session expired, clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            throw error;
        }
    }

    async logout() {
        try {
            await this.request('auth', '/api/auth/logout', {
                method: 'POST'
            });
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            throw error;
        }
    }

    // Student Services
    async getStudents(page = 0, size = 100) {
        try {
            return await this.request('student', `/api/students?page=${page}&size=${size}`);
        } catch (error) {
            console.error('Error fetching students:', error);
            return { content: [], totalElements: 0 };
        }
    }

    async getStudentById(id) {
        return this.request('student', `/api/students/${id}`);
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

    // Lecturer Services
    async getLecturers() {
        try {
            return await this.request('lecturer', '/api/lecturers');
        } catch (error) {
            console.error('Error fetching lecturers:', error);
            return [];
        }
    }

    async getLecturerById(id) {
        return this.request('lecturer', `/api/lecturers/${id}`);
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

    // Course Services
    async getCourses() {
        try {
            return await this.request('course', '/api/courses');
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }

    async getCoursesByLecturer(lecturerId) {
        try {
            const courses = await this.getCourses();
            return courses.filter(course => course.lecturerId === lecturerId);
        } catch (error) {
            console.error('Error fetching lecturer courses:', error);
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

    // Assignment Services
    async getAssignments(courseId = null) {
        const endpoint = courseId ? `/api/assignments?courseId=${courseId}` : '/api/assignments';
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

    // Quiz Services
    async getAllQuizzes() {
        try {
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

    async getQuizzesByCourse(courseId) {
        try {
            return await this.request('quiz', `/api/quizzes/course/${courseId}`);
        } catch (error) {
            console.error('Error fetching quizzes by course:', error);
            return [];
        }
    }

    async createQuiz(quiz) {
        return this.request('quiz', '/api/quizzes', {
            method: 'POST',
            body: JSON.stringify(quiz)
        });
    }

    async updateQuiz(id, quiz) {
        return this.request('quiz', `/api/quizzes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(quiz)
        });
    }

    async deleteQuiz(id) {
        return this.request('quiz', `/api/quizzes/${id}`, {
            method: 'DELETE'
        });
    }

    async getQuestions(quizId) {
        try {
            return await this.request('quiz', `/api/quizzes/${quizId}/questions`);
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    }

    async createQuestion(question) {
        return this.request('quiz', '/api/quizzes/questions', {
            method: 'POST',
            body: JSON.stringify(question)
        });
    }

    async deleteQuestion(id) {
        return this.request('quiz', `/api/quizzes/questions/${id}`, {
            method: 'DELETE'
        });
    }

    async submitQuizAttempt(quizId, studentId, answers) {
        const submissionData = {
            quizId: quizId,
            studentId: studentId,
            answers: answers
        };

        return this.request('quiz', `/api/quizzes/${quizId}/submit/${studentId}`, {
            method: 'POST',
            body: JSON.stringify(submissionData)
        });
    }

    async getAttemptsByStudent(studentId) {
        try {
            return await this.request('quiz', `/api/quizzes/attempts/${studentId}`);
        } catch (error) {
            console.error('Error fetching student attempts:', error);
            return [];
        }
    }

    async getAllAttempts() {
        try {
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

    // Submission Services
    async getSubmissions(assignmentId = null, studentId = null) {
        let endpoint = '/api/submissions';
        if (assignmentId) endpoint = `/api/submissions/assignment/${assignmentId}`;
        if (studentId) endpoint = `/api/submissions/student/${studentId}`;

        try {
            return await this.request('submission', endpoint);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            return [];
        }
    }

    async createSubmission(submission) {
        try {
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

    // Announcement Services
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
            const formattedAnnouncement = {
                ...announcement,
                courseId: announcement.courseId || null,
                title: announcement.title?.trim(),
                message: announcement.message?.trim()
            };

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

    // Material Services
    async getMaterials(courseId = null) {
        const endpoint = courseId ? `/api/materials/course/${courseId}` : '/api/materials';
        try {
            return await this.request('material', endpoint);
        } catch (error) {
            console.error('Error fetching materials:', error);
            return [];
        }
    }

    async createMaterial(material) {
        return this.request('material', '/api/materials', {
            method: 'POST',
            body: JSON.stringify(material)
        });
    }

    async deleteMaterial(id) {
        return this.request('material', `/api/materials/${id}`, {
            method: 'DELETE'
        });
    }

    // Dashboard Stats
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
}

export default APIService;