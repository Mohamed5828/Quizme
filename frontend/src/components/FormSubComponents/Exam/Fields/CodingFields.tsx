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
      <p className="text-red-600 mt-1">This field is required</p>
    ) : null;

  const gradeError =
    Array.isArray(errors?.questions) && errors.questions[index]?.grade ? (
      <p className="text-red-600 mt-1">
        This field is required and must be a number greater than 0
      </p>
    ) : null;

  const codeError =
    Array.isArray(errors?.questions) && errors.questions[index]?.code ? (
      <p className="text-red-600 mt-1">This field is required</p>
    ) : null;

  return (
    <div className="coding-fields-container bg-white p-6 rounded-lg shadow-md mb-6 border border-emerald-300">
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
        className="border-2 border-emerald-300 rounded p-3 w-full mb-4 focus:outline-none focus:border-emerald-500"
        {...register(`questions.${index}.grade`, {
          required: true,
          min: 1,
          valueAsNumber: true,
        })}
        placeholder={`Question ${index + 1} Grade`}
      />
      {gradeError}

      <div className="boilerplate-code-container mb-6">
        <h3 className="text-lg font-bold tracking-widest mb-2">
          Boiler Plate Code
        </h3>
        <textarea
          className="border-2 border-emerald-300 rounded p-3 w-full focus:outline-none focus:border-emerald-500"
          placeholder={`To start an editable block comment BEGINCODE\nTo end an editable block comment ENDCODE\nNOTE: these are reserved keywords and should not be used otherwise you will encounter unexpected behaviour.`}
          {...register(`questions.${index}.code`, { required: true })}
        ></textarea>
        {codeError}
      </div>

      <div className="test-cases-container">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold tracking-widest">Test Cases</h3>
          <button
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-3 rounded-md transition text-sm"
            onClick={() => append({ input: "", output: "" })}
            type="button"
          >
            Add Testcase
          </button>
        </div>
        {fields.map((item, tIndex) => (
          <div
            className="test-case-item border border-emerald-300 p-4 rounded-md mb-4"
            key={item.id}
          >
            <div className="flex flex-col gap-2 mb-2">
              <input
                type="text"
                placeholder="Input"
                className="border-2 border-emerald-300 rounded p-3 w-full focus:outline-none focus:border-emerald-500"
                {...register(`questions.${index}.testCases.${tIndex}.input`, {
                  required: true,
                  minLength: 1,
                })}
              />
              {Array.isArray(errors?.questions) &&
                errors.questions[index]?.testCases?.[tIndex]?.input && (
                  <p className="text-red-600 mt-1">Input field is required</p>
                )}
              <input
                type="text"
                placeholder="Output"
                className="border-2 border-emerald-300 rounded p-3 w-full focus:outline-none focus:border-emerald-500"
                {...register(`questions.${index}.testCases.${tIndex}.output`, {
                  required: true,
                  minLength: 1,
                })}
              />
              {Array.isArray(errors?.questions) &&
                errors.questions[index]?.testCases?.[tIndex]?.output && (
                  <p className="text-red-600 mt-1">Output field is required</p>
                )}
            </div>
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md transition text-sm w-full"
              onClick={() => remove(tIndex)}
              type="button"
              disabled={fields.length <= 1} // Prevent removing if fewer than 1 test case
            >
              Remove Testcase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodingFields;
