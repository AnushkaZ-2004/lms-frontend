import React, { useState, useEffect } from 'react';
import QuizService from '../../services/QuizService';
import CourseService from '../../services/CourseService';
import DataTable from '../../components/ui/DataTable';
import QuizForm from '../../components/forms/QuizForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ManagePage.css';

function ManageQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [quizzesRes, coursesRes] = await Promise.all([
                    QuizService.getQuizzes(),
                    CourseService.getCourses()
                ]);
                setQuizzes(quizzesRes.data);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (quiz) => {
        setCurrentQuiz(quiz);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await QuizService.deleteQuiz(id);
                setQuizzes(prev => prev.filter(q => q.id !== id));
            } catch (error) {
                console.error('Failed to delete quiz:', error);
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentQuiz) {
                await QuizService.updateQuiz(currentQuiz.id, formData);
                setQuizzes(prev => prev.map(q =>
                    q.id === currentQuiz.id ? { ...q, ...formData } : q
                ));
            } else {
                const response = await QuizService.createQuiz(formData);
                setQuizzes(prev => [...prev, response.data]);
            }
            setShowModal(false);
            setCurrentQuiz(null);
        } catch (error) {
            console.error('Failed to save quiz:', error);
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? `${course.code} - ${course.title}` : 'Unknown Course';
    };

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCourseName(quiz.courseId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id', sortable: true },
        {
            header: 'Course',
            accessor: 'courseId',
            render: (row) => getCourseName(row.courseId)
        },
        { header: 'Title', accessor: 'title', sortable: true },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="action-buttons">
                    <Button small onClick={() => handleEdit(row)}>Edit</Button>
                    <Button small danger onClick={() => handleDelete(row.id)}>Delete</Button>
                    <Button small onClick={() => {/* Navigate to manage questions */ }}>
                        Questions
                    </Button>
                </div>
            ),
        },
    ];

    if (loading && quizzes.length === 0) return <LoadingSpinner />;

    return (
        <div className="manage-page">
            <div className="page-header">
                <h1>Manage Quizzes</h1>
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Button
                        primary
                        onClick={() => {
                            setCurrentQuiz(null);
                            setShowModal(true);
                        }}
                    >
                        Add Quiz
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredQuizzes}
                pagination
                itemsPerPage={10}
            />

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setCurrentQuiz(null);
                }}
                title={currentQuiz ? 'Edit Quiz' : 'Add New Quiz'}
            >
                <QuizForm
                    initialValues={currentQuiz || {}}
                    courses={courses}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
}

export default ManageQuizzes;