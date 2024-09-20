import { useFormContext, useFieldArray } from "react-hook-form";
import QuestionFields from "./Fields/QuestionFields";
import { useEffect } from "react";

const QuestionsStep = () => {
  const { register, control, getValues, setValue } = useFormContext(); // Access control from context
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
        code: "",
      });
    }
  }, [append, fields.length]);

  const watchedQuestions = getValues("questions");
  return (
    <>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col space-y-2 p-4 shadow border rounded"
        >
          <div className="flex justify-between">
            <h2 className="text-xl font-bold tracking-widest">
              Question {index + 1}
            </h2>
            <select
              className="text-black border-2 border-gray-300 rounded p-2"
              {...register(`questions.${index}.type`, { required: true })}
            >
              <option value="">None</option>
              <option value="mcq">MCQ</option>
              <option value="code">Code</option>
            </select>
          </div>
          <QuestionFields index={index} />
          <div className="flex justify-end">
            <button
              type="button"
              className="border-2 border-gray-950 text-gray-950  hover:bg-gray-500 hover:text-white font-bold py-2 px-4 rounded-full transition mr-2"
              onClick={() => {
                const resetQ = watchedQuestions[index];
                Object.keys(watchedQuestions[index]).forEach((key: string) => {
                  resetQ[key] = "";
                });
                setValue(`questions.${index}`, { ...resetQ });
              }}
            >
              Reset
            </button>
            <button
              className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition"
        type="button"
        onClick={() => append({ desc: "", type: "", grade: "" })}
      >
        Add Question
      </button>
    </>
  );
};

export default QuestionsStep;
