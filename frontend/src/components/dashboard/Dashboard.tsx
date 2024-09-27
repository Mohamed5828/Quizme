import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spin, message, Button } from "antd";
import { useFetchData } from "../../hooks/useFetchData";
import { getAxiosInstance } from "../../utils/axiosInstance";

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
  const axiosInstance = getAxiosInstance("/v2");

  useEffect(() => {
    const fetchExams = async () => {
      const { data, error } = await useFetchData<Exam[]>("/exams/");
      if (data) {
        setExams(data);
      }
      if (error) {
        message.error("Failed to fetch exams");
        console.error(error);
      }
    };

    fetchExams();
  }, []);

  const handleDeleteExam = async (exam_code: string) => {
    try {
      await axiosInstance.delete(`/exams/${exam_code}/`);
      setExams(exams.filter((exam) => exam.exam_code !== exam_code));
      message.success("Exam deleted successfully");
    } catch (error) {
      message.error("Failed to delete exam");
      console.error(error);
    }
  };
  // Define columns for Ant Design table
  const columns = [
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Exam Code",
      dataIndex: "exam_code",
      key: "exam_code",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
    },
    {
      title: "Questions Count",
      key: "questions",
      render: (record: Exam) => <span>{record.questions.length}</span>,
    },
    {
      title: "Action",
      key: "action",
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
    <div style={{ padding: "20px" }}>
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
