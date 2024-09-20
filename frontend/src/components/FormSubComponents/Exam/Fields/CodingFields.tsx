import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { QuestionFieldsProps } from "./QuestionFields";
import MarkdownViewer from "../../../Viewers/MarkdownViewer";

const CodingFields = ({ index }: QuestionFieldsProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `questions.${index}.testCases`,
    control,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ input: "", output: "" });
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
  const codeError =
    Array.isArray(errors?.questions) && errors.questions[index]?.code ? (
      <p className="text-red-600">This field is required</p>
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
      <div className="flex gap-2 [&_input]:max-h-[30px]">
        <div className="w-1/2 flex flex-col">
          <h3 className="text-l font-bold tracking-widest mb-2">
            Boiler Plate Code
          </h3>

          <textarea
            className="border-2 border-gray-300 rounded p-2"
            placeholder={`to start an editable block comment BEGINCODE\nto end an editable block comment ENDCODE\nNOTE: these are reserved keywords and should not be used otherwise you will encounter unexpected behaviour.`}
            {...register(`questions.${index}.code`, { required: true })}
          ></textarea>
          {codeError}
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex justify-between mb-1">
            <h3 className="text-l font-bold tracking-widest">Test Cases</h3>
            <button
              className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md transition text-sm"
              onClick={() => append({ desc: "", isCorrect: false })}
              type="button"
            >
              Add Testcase
            </button>
          </div>
          {fields.map((item, tIndex) => (
            <div
              className="flex gap-2 border p-2 rounded items-center mb-1"
              key={item.id}
            >
              <input
                type="text"
                placeholder="Input"
                {...register(`questions.${index}.testCases.${tIndex}.input`, {
                  required: true,
                  minLength: 1,
                })}
              />
              <input
                type="text"
                placeholder="Output"
                {...register(`questions.${index}.testCases.${tIndex}.output`, {
                  required: true,
                  minLength: 1,
                })}
              />
              <button
                className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md transition text-sm"
                onClick={() => remove(tIndex)}
                type="button"
              >
                Remove Testcase
              </button>
              {Array.isArray(errors?.questions) &&
                errors.questions[index]?.testCases[tIndex] && (
                  <p className="text-red-600">These fields are required</p>
                )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CodingFields;
