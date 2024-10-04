
import React, { useEffect, useCallback, useState } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { Trash2, Edit, Plus } from "lucide-react";
import QuestionsStep from "../FormSubComponents/Exam/QuestionsStep";
import { useFetchData } from "../../hooks/useFetchData";
import postData from "../../utils/postData";
import putData from "../../utils/putData";
import AddToExamDropdown from "../QuestionComponents/AddToExamDropdown";
import BasicSpinner from "../Basic/BasicSpinner";
import deleteData from "../../utils/deleteData";

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
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const { data, loading, error, refetch } = useFetchData<Question[]>("/questionbanks/");
  const { data: examsData } = useFetchData<{ exams: Exam[] }>("/exams/", "v2");

  useEffect(() => {
    if (data) {
      methods.reset({ questions: data });
    }
  }, [data, methods]);

  const filteredQuestions = data?.filter((question) => {
    const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;
    const matchesType = !typeFilter || question.type === typeFilter;
    const matchesTag = !tagFilter || question.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));

    return matchesDifficulty && matchesType && matchesTag;
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const responses = [];
      for (const question of formData.questions) {
        const response = question?.id
          ? await putData(`/questionbanks/${question.id}/`, question)
          : await postData("/questionbanks/", question, "v1");
        responses.push(response);
      }

      if (!responses.some((response) => response.error)) {
        console.log("Submission successful:", responses);
        refetch();
        setEditingQuestion(null);
      } else {
        console.error("Error submitting:", responses);
      }
    },
    [refetch]
  );

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    methods.reset({ questions: [question] });
  };

  const handleDelete = async (questionId: string) => {
    const response = await deleteData(`/questionbanks/${questionId}/`);
    if (!response.error) {
      console.log("Question deleted");
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
      ? "/exams/add-question/"
      : "/exams/remove-question/";

    const response = await postData(endpoint, { questionId, examId }, "v2");
    if (!response.error) {
      console.log(
        isAdding ? "Question added to exam" : "Question removed from exam"
      );
    } else {
      console.error("Error updating exam:", response.error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, filterType: string) => {
    const value = e.target.value;
    switch (filterType) {
      case 'difficulty':
        setDifficultyFilter(value);
        break;
      case 'type':
        setTypeFilter(value);
        break;
      case 'tag':
        setTagFilter(value);
        break;
      default:
        break;
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600">{<BasicSpinner />}</div>
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

      {/* Filter Dropdowns */}
      <div className="flex space-x-4 mb-6">
        <select 
          value={difficultyFilter} 
          onChange={(e) => handleFilterChange(e, 'difficulty')} 
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select 
          value={typeFilter} 
          onChange={(e) => handleFilterChange(e, 'type')} 
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">All Types</option>
          <option value="mcq">Multiple Choice</option>
          <option value="code">Code</option>
        </select>
        <input 
          type="text" 
          value={tagFilter} 
          onChange={(e) => handleFilterChange(e, 'tag')} 
          placeholder="Filter by tag..." 
          className="border border-gray-300 rounded-md p-2"
        />
      </div>

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
        <div>
          <button
            onClick={() => {
              setEditingQuestion({ id: "", desc: "", type: "mcq", difficulty: "easy", tags: [] });
              methods.reset({ questions: [{ id: "", desc: "", type: "mcq", difficulty: "easy", tags: [] }] });
            }}
            className="mb-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            <Plus className="inline mr-2" /> Add Question
          </button>
          <div className="space-y-6">
            {filteredQuestions && 
              filteredQuestions.map((question) => (
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
                          examsData?.exams?.map((exam) => ({
                            ...exam,
                            hasQuestion: false, 
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
                        {question.tags.join(", ") || "None"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
