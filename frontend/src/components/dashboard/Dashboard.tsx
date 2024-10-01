import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spin, message, Button } from "antd";
import { useFetchData } from "../../hooks/useFetchData";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

// Define the structure of the Exam data
interface Question {
  question_id: number;
  question_body: object;
}

interface Exam {
  exam_id: number;
  duration: string;
  examCode: string;
  startDate: string;
  expirationDate: string;
  questions: Question[];
}

// Utility function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", // adjust according to your timezone
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const axiosInstance = getAxiosInstance("v2");
  const { data, error, loading } = useFetchData<Exam[]>("/exams/", "v2");
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setExams(data);
    }
    if (error) {
      message.error("Failed to fetch exams");
      console.error(error);
    }
  }, [data, error]);

  const handleDeleteExam = async (exam_code: string) => {
    try {
      await axiosInstance.delete(`/exams/${exam_code}/`);
      setExams(exams.filter((exam) => exam.examCode !== exam_code));
      message.success("Exam deleted successfully");
    } catch (error) {
      message.error("Failed to delete exam");
      console.error(error);
    }
  };

  const handleRowClick = (examCode: string) => {
    navigate(`/exam-result/${examCode}`);
  };

  const columns = [
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Exam Code",
      dataIndex: "examCode",
      key: "examCode",
    },
    {
      title: "Created At",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => formatDate(text), // Format startDate
    },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (text: string) => formatDate(text), // Format expirationDate
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
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteExam(record.examCode);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {loading ? (
        <Spin size="large" className="m-auto w-100" />
      ) : (
        <Table
          dataSource={exams}
          columns={columns}
          rowKey="exam_id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record.examCode),
            className: "cursor-pointer",
          })}
        />
      )}
    </div>
  );
};

export default Dashboard;
