import React, { useState } from "react";
import { Plus } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  hasQuestion: boolean;
}

interface AddToExamDropdownProps {
  questionId: string;
  exams: Exam[];
  onAddRemove: (questionId: string, examId: string, isAdding: boolean) => void;
}

const AddToExamDropdown: React.FC<AddToExamDropdownProps> = ({
  questionId,
  exams,
  onAddRemove,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
      >
        <Plus size={20} aria-hidden="true" />
        <span className="sr-only">Add to Exam</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 bg-white shadow-md rounded-md mt-2 sm:max-w-md">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">Add to Exam</h3>
            <div className="mt-6 max-h-60 overflow-y-auto">
              {exams.map((exam) => (
                <div key={exam.id} className="flex items-center space-x-3 py-2">
                  <input
                    type="checkbox"
                    id={`exam-${exam.id}`}
                    checked={exam.hasQuestion}
                    onChange={(e) =>
                      onAddRemove(questionId, exam.id, e.target.checked)
                    }
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`exam-${exam.id}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {exam.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToExamDropdown;
