import { apiInstances } from './api';

export const studentService = {
    getAllStudents: async (page = 0, size = 10, search = '') => {
        try {
            console.log('🔄 StudentService: Trying paginated endpoint...');
            const response = await apiInstances.students.get(`/?page=${page}&size=${size}&search=${search}`);
            console.log('✅ StudentService: Paginated response received');
            return response.data;
        } catch (error) {
            console.log('❌ StudentService: Paginated failed, trying simple endpoint...');
            try {
                const response = await apiInstances.students.get('/all');
                console.log('✅ StudentService: Simple response received');

                const data = response.data;
                return {
                    content: data,
                    totalElements: data.length,
                    totalPages: Math.ceil(data.length / size),
                    number: page,
                    size: size,
                    first: page === 0,
                    last: page >= Math.ceil(data.length / size) - 1
                };
            } catch (fallbackError) {
                console.error('❌ StudentService: Both endpoints failed');
                throw fallbackError;
            }
        }
    },

    createStudent: async (studentData) => {
        console.log('➕ StudentService: Creating student');
        const response = await apiInstances.students.post('/', studentData);
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        console.log('✏️ StudentService: Updating student', id);
        const response = await apiInstances.students.put(`/${id}`, studentData);
        return response.data;
    },

    deleteStudent: async (id) => {
        console.log('🗑️ StudentService: Deleting student', id);
        const response = await apiInstances.students.delete(`/${id}`);
        return response.data;
    },

    getStudentById: async (id) => {
        console.log('🔍 StudentService: Getting student by ID', id);
        const response = await apiInstances.students.get(`/${id}`);
        return response.data;
    }
};