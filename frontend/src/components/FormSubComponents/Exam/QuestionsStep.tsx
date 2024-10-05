import { useFormContext, useFieldArray } from "react-hook-form";
import QuestionFields from "./Fields/QuestionFields";
import { useEffect } from "react";

const QuestionsStep = () => {
  const { register, control, getValues, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        desc: "",
        type: "",
        grade: "",
        choices: [],
        testCases: [],
        code: [],
        tags: [],
        difficulty: "",
      });
    }
  }, [append, fields.length]);
  console.log(fields);

  const watchedQuestions = getValues("questions");
  const handleTagInputBlur = (index: number) => {
    const tagsInput = getValues(`questions.${index}.tags`);
    const tagsArray = tagsInput.split(",").map((tag: string) => tag.trim());
    setValue(`questions.${index}.tags`, tagsArray);
  };
  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Question {index + 1}
              </h2>
              <select
                className="bg-white text-gray-800 border-2 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                {...register(`questions.${index}.type`, { required: true })}
              >
                <option value="">Select Type</option>
                <option value="mcq">MCQ</option>
                <option value="code">Code</option>
              </select>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <QuestionFields index={index} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  {...register(`questions.${index}.tags`)}
                  placeholder="Comma separated tags"
                  onBlur={() => handleTagInputBlur(index)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  className="w-full bg-white border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  {...register(`questions.${index}.difficulty`)}
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                onClick={() => {
                  const resetQ = watchedQuestions[index];
                  Object.keys(watchedQuestions[index]).forEach((key) => {
                    resetQ[key] = key === "tags" ? [] : "";
                  });
                  setValue(`questions.${index}`, { ...resetQ });
                }}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                type="button"
                onClick={() => remove(index)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        className="w-full px-6 py-3 border border-transparent rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
        type="button"
        onClick={() =>
          append({ desc: "", type: "", grade: "", tags: [], difficulty: "" })
        }
      >
        Add Question
      </button>
    </div>
  );
};

export default QuestionsStep;
