import React, { useEffect, useCallback, useState } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { Trash2, Edit, Plus } from "lucide-react";
import QuestionsStep from "../FormSubComponents/Exam/QuestionsStep";
import { useFetchData } from "../../hooks/useFetchData";
import postData from "../../utils/postData";
import AddToExamDropdown from "../QuestionComponents/AddToExamDropdown";

interface Question {
  id: string;
  desc: string;
  type: string;
  difficulty: string;
  tags: string[];
}

interface Exam {
  id: string;
  name: string;
}

interface FormData {
  questions: Question[];
}

const QuestionBank: React.FC = () => {
  const methods: UseFormReturn<FormData> = useForm<FormData>({
    defaultValues: {
      questions: [],
    },
  });

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { data, loading, error, refetch } =
    useFetchData<Question[]>("/v1/questionbank/");
  const { data: examsData } = useFetchData<{ exams: Exam[] }>("/v1/exam/list/");

  useEffect(() => {
    if (data) {
      methods.reset({ questions: data });
    }
  }, [data, methods]);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const response = await postData("/v1/questionbank/", formData);
      if (!response.error) {
        console.log("Submission successful:", response.resData);
        refetch();
        setEditingQuestion(null);
      } else {
        console.error("Error submitting:", response.error);
      }
    },
    [refetch]
  );

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    methods.reset({ questions: [question] });
  };

  const handleDelete = async (questionId: string) => {
    const response = await postData(
      `/v1/questionbank/${questionId}/delete/`,
      {}
    );
    if (!response.error) {
      console.log("Question deleted successfully");
      refetch();
    } else {
      console.error("Error deleting question:", response.error);
    }
  };

  const handleAddRemoveFromExam = async (
    questionId: string,
    examId: string,
    isAdding: boolean
  ) => {
    const endpoint = isAdding
      ? "/v1/exam/add-question/"
      : "/v1/exam/remove-question/";
    const response = await postData(endpoint, { questionId, examId });
    if (!response.error) {
      console.log(
        isAdding ? "Question added to exam" : "Question removed from exam"
      );
    } else {
      console.error("Error updating exam:", response.error);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600">Loading questions...</div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error loading questions: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Question Bank</h1>

      {editingQuestion ? (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <QuestionsStep />
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div className="space-y-6">
          {data &&
            data.map((question) => (
              <div
                key={question.id}
                className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {question.desc}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="p-2 text-yellow-600 hover:text-yellow-800 transition duration-300 ease-in-out"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                    >
                      <Trash2 size={20} />
                    </button>
                    <AddToExamDropdown
                      questionId={question.id}
                      exams={
                        examsData?.exams.map((exam) => ({
                          ...exam,
                          hasQuestion: false, // default to false, compute this based on actual data
                        })) || []
                      }
                      onAddRemove={handleAddRemoveFromExam}
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Type:{" "}
                    <span className="font-medium text-gray-800">
                      {question.type}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Difficulty:{" "}
                    <span className="font-medium text-gray-800">
                      {question.difficulty}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Tags:{" "}
                    <span className="font-medium text-gray-800">
                      {question.tags.join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}

      {!editingQuestion && (
        <button
          onClick={() => {
            setEditingQuestion({} as Question);
            methods.reset({ questions: [{}] as Question[] });
          }}
          className="mt-8 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
        >
          Add New Question
        </button>
      )}
    </div>
  );
};

export default QuestionBank;
