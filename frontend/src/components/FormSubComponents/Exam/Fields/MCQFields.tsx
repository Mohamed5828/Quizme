import { useFormContext, useFieldArray } from "react-hook-form";
import MarkdownViewer from "../../../Viewers/MarkdownViewer";
import { useEffect } from "react";
import { QuestionFieldsProps } from "./QuestionFields";

const MCQFields = ({ index }: QuestionFieldsProps) => {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `questions.${index}.choices`,
    control,
  });

  useEffect(() => {
    if (fields.length < 2) {
      append({ desc: "", isCorrect: false });
    }
  }, [append, fields.length]);

  const descError =
    Array.isArray(errors?.questions) && errors.questions[index]?.desc ? (
      <p className="text-red-600 mt-1">This field is required</p>
    ) : null;

  const gradeError =
    Array.isArray(errors?.questions) && errors.questions[index]?.grade ? (
      <p className="text-red-600 mt-1">
        This field is required and must be a number greater than 0
      </p>
    ) : null;

  const validateUniqueChoiceDesc = (desc: string) => {
    const choices = getValues(`questions.${index}.choices`);
    return (
      choices.filter((choice: any) => choice.desc === desc).length <= 1 ||
      "Choices must be unique"
    );
  };

  return (
    <div className="mcq-fields-container bg-white p-6 rounded-lg shadow-md mb-6 border border-emerald-300">
      <div className="flex flex-wrap gap-4 sm:flex-col mb-4">
        <textarea
          className="border-2 border-emerald-300 rounded p-3 w-full focus:outline-none focus:border-emerald-500"
          {...register(`questions.${index}.desc`, { required: true })}
          placeholder={`Question ${index + 1} Description`}
        />
        <MarkdownViewer index={index} />
      </div>
      {descError}
      <input
        type="number"
        className="border-2 border-emerald-300 rounded p-3 mt-2 w-full focus:outline-none focus:border-emerald-500"
        {...register(`questions.${index}.grade`, {
          required: true,
          min: 1,
          valueAsNumber: true,
        })}
        placeholder={`Question ${index + 1} Grade`}
      />
      {gradeError}
      <div className="choices-container mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold tracking-widest">Choices</h3>
          <button
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-3 rounded-md transition text-sm"
            onClick={() => append({ desc: "", isCorrect: false })}
            type="button"
          >
            Add Choice
          </button>
        </div>
        {fields.map((item, cIndex) => (
          <div
            key={item.id || `${index}-${cIndex}`}
            className="choice-item mb-4"
          >
            <div className="flex items-center gap-2 p-3 border border-emerald-300 rounded-md">
              <input
                type="text"
                className="border-2 border-emerald-300 rounded p-2 flex-grow focus:outline-none focus:border-emerald-500"
                {...register(`questions.${index}.choices.${cIndex}.desc`, {
                  required: true,
                  minLength: 1,
                  validate: validateUniqueChoiceDesc,
                })}
                placeholder={`Choice ${cIndex + 1}`}
              />
              <input
                type="checkbox"
                title="Correct Answer"
                {...register(`questions.${index}.choices.${cIndex}.isCorrect`, {
                  validate: (value) =>
                    getValues(`questions.${index}.choices`).some(
                      (c: any) => c.isCorrect
                    ) || "At least one choice must be correct",
                })}
              />
              <button
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded-md transition text-sm"
                onClick={() => remove(cIndex)}
                type="button"
                disabled={fields.length <= 2} // Prevent removing if fewer than 2 choices
              >
                Remove
              </button>
            </div>
            {Array.isArray(errors?.questions) &&
              errors.questions[index]?.choices?.[cIndex]?.desc && (
                <p className="text-red-600 mt-1">
                  This field is required and must be unique
                </p>
              )}
          </div>
        ))}
        {Array.isArray(errors?.questions) &&
          errors.questions[index]?.choices?.some(
            (c: any) => c.isCorrect === false
          ) && (
            <p className="text-red-600 mt-2">
              At least one choice must be correct
            </p>
          )}
      </div>
    </div>
  );
};

export default MCQFields;
