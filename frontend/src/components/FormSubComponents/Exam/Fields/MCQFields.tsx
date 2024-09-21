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
      <p className="text-red-600">This field is required</p>
    ) : null;

  const gradeError =
    Array.isArray(errors?.questions) && errors.questions[index]?.grade ? (
      <p className="text-red-600">
        This field is required and must be a number greater than 0
      </p>
    ) : null;

  return (
    <>
      <div className="flex [&>*]:w-1/2 gap-2 sm:[&>*]:w-full">
        <textarea
          className="border-2 border-gray-300 rounded p-2"
          {...register(`questions.${index}.desc`, { required: true })}
          placeholder={`Question ${index + 1} Description`}
        />
        <MarkdownViewer index={index} />
      </div>
      {descError}
      <input
        type="number"
        {...register(`questions.${index}.grade`, {
          required: true,
          min: 1,
        })}
        placeholder={`Question ${index + 1} Grade`}
      />
      {gradeError}
      <div className="flex flex-col gap-2 [&_input]:max-h-[30px]">
        <div className="flex justify-between ">
          <h3 className="text-l font-bold tracking-widest">Choices</h3>
          <button
            className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md transition text-sm"
            onClick={() => append({ desc: "", isCorrect: false })}
            type="button"
          >
            Add Choice
          </button>
        </div>
        {fields.map((item, cIndex) => (
          <div
            className="flex gap-2 border p-2 rounded items-center"
            key={item.id}
          >
            <input
              type="text"
              {...register(`questions.${index}.choices.${cIndex}.desc`, {
                required: true,
                minLength: 1,
              })}
            />
            <input
              type="checkbox"
              title="Correct Answer"
              {...register(`questions.${index}.choices.${cIndex}.isCorrect`, {
                validate: (value) =>
                  getValues(`questions.${index}.choices`).some(
                    (c: { isCorrect: boolean }) => c.isCorrect
                  ) &&
                  (value === true || value === false),
              })}
            />
            <button
              className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md transition text-sm"
              onClick={() => remove(cIndex)}
              type="button"
            >
              Remove Choice
            </button>
            {Array.isArray(errors?.questions) &&
              errors.questions[index]?.choices[cIndex]?.desc && (
                <p className="text-red-600">This field is required</p>
              )}
          </div>
        ))}
        {Array.isArray(errors?.questions) &&
          errors.questions[index]?.choices[0].isCorrect && (
            <p className="text-red-600">At least one choice must be correct</p>
          )}
      </div>
    </>
  );
};

export default MCQFields;
