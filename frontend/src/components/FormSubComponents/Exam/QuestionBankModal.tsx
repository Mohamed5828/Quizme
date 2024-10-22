import { useState, useEffect } from "react";
import { Modal, Input, Button, Card, Tag, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { useFetchData } from "../../../hooks/useFetchData";
import BasicSpinner from "../../Basic/BasicSpinner";

const { Meta } = Card;

interface Question {
  id: string;
  desc: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  choices?: any[];
  testCases?: any[];
  code?: any[];
}

interface QuestionBankModalProps {
  onSelectQuestion: (question: Question) => void;
}

const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  onSelectQuestion,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  const {
    data: questions,
    loading,
    error,
  } = useFetchData<Question[]>("/questionbanks/");

  useEffect(() => {
    if (questions) {
      const filtered = questions.filter(
        (question) =>
          question.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredQuestions(filtered);
    }
  }, [searchTerm, questions]);

  if (error) {
    console.error("Error fetching questions:", error);
    return null;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        type="primary"
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
        onClick={openModal}
        
      >
        Browse Question Bank
      </Button>

      <Modal
        title="Question Bank"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={800}
        className="max-h-[80vh] overflow-y-auto"
        
      >
        <div className="relative mb-4">
          <Input
            placeholder="Search questions by description or tags..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              tip="Loading questions..."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredQuestions.map((question) => (
              <Card
                key={question.id}
                hoverable
                className="hover:shadow-lg transition-shadow border-emerald-200 rounded-lg"
                style={{ borderColor: "#10B981" }}
                actions={[
                  <Button
                    key="add"
                    type="primary"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    onClick={() => {
                      onSelectQuestion(question);
                      closeModal();
                    }}
                  >
                    Add to Exam
                  </Button>,
                ]}
              >
                <Meta
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-lg">{question.desc}</span>
                      <Tag
                        color={
                          question.difficulty === "easy"
                            ? "green"
                            : question.difficulty === "medium"
                              ? "gold"
                              : "red"
                        }
                        className="rounded-full px-2 py-1"
                      >
                        {question.difficulty}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.tags.map((tag, index) => (
                        <Tag key={index} color="default" className="rounded-md">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default QuestionBankModal;
