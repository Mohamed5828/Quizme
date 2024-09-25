import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, message, Button } from 'antd';

// Define the structure of the Exam data
interface Question {
    question_id: number;
    question_body: object;
}

interface Exam {
    exam_id: number;
    duration: string;
    exam_code: string;
    created_at: string;
    expiration_date: string;
    questions: Question[];
}

const Dashboard: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Function to fetch exam data
        const fetchExams = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get<Exam[]>('http://127.0.0.1:8000/api/v2/exam/', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            });
            setExams(response.data);
        } catch (error) {
            message.error('Failed to fetch exams');
            console.error(error);
        } finally {
            setLoading(false);
    }
    };

    fetchExams();
    }, []);

    // Function to handle deleting an exam
    const handleDeleteExam = async (exam_code: string) => {
        try {
        const accessToken = localStorage.getItem('accessToken');
        await axios.delete(`http://127.0.0.1:8000/api/v2/exam/${exam_code}/`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
        // Remove the deleted exam from the state
        setExams(exams.filter(exam => exam.exam_code !== exam_code));
        message.success('Exam deleted successfully');
        } catch (error) {
        message.error('Failed to delete exam');
        console.error(error);
        }
    };

  // Define columns for Ant Design table
    const columns = [
        {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        },
        {
        title: 'Exam Code',
        dataIndex: 'exam_code',
        key: 'exam_code',
        },
        {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        },
        {
        title: 'Expiration Date',
        dataIndex: 'expiration_date',
        key: 'expiration_date',
        },
        {
        title: 'Questions Count',
        key: 'questions',
        render: (record: Exam) => <span>{record.questions.length}</span>,
        },
        {
        title: 'Action',
        key: 'action',
        render: (text: string, record: Exam) => (
            <Button
            type="primary"
            danger
            onClick={() => handleDeleteExam(record.exam_code)}
            >
            Delete
            </Button>
        ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
        <h1>Instructor Dashboard</h1>
        {loading ? (
            <Spin size="large" />
        ) : (
            <Table dataSource={exams} columns={columns} rowKey="exam_id" />
        )}
        </div>
    );
    };

export default Dashboard;
