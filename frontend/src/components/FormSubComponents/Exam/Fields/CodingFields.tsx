import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { QuestionFieldsProps } from "./QuestionFields";
import MarkdownViewer from "../../../Viewers/MarkdownViewer";
import { CodeData } from "../../../Viewers/ExamPage/components/QuestionContainer";
import CodeInputs from "./CodeInputs";

const CodingFields = ({ index }: QuestionFieldsProps) => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `questions.${index}.testCases`,
    control,
  });

  // Initialize code data structure if empty
  useEffect(() => {
    const currentCode = watch(`questions.${index}.code`);
    if (!currentCode) {
      setValue(`questions.${index}.code`, {
        body: "",
        language: "",
        version: "",
      });
    }
  }, []);

  // Initialize test cases if empty
  useEffect(() => {
    if (fields.length === 0) {
      append({ input: "", output: "" });
    }
  }, [append, fields.length]);

  // Watch the code object
  const codeData = watch(`questions.${index}.code`);

  const handleCodeChange = (updates: Partial<CodeData>) => {
    setValue(
      `questions.${index}.code`,
      {
        ...codeData,
        ...updates,
      },
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  // Error messages
  const getErrorMessage = (path: string) => {
    return errors?.questions?.[index]?.[path] ? (
      <p className="text-red-600 mt-1">
        {typeof errors.questions[index][path] === "string"
          ? errors.questions[index][path].message
          : "This field is required"}
      </p>
    ) : null;
  };

  return (
    <div className="coding-fields-container bg-white p-6 rounded-lg shadow-md mb-6 border border-emerald-300">
      {/* Question Description */}
      <div className="flex flex-wrap gap-4 sm:flex-col mb-4">
        <textarea
          className="border-2 border-emerald-300 rounded p-3 w-full focus:outline-none focus:border-emerald-500"
          {...register(`questions.${index}.desc`, {
            required: "Description is required",
          })}
          placeholder={`Question ${index + 1} Description`}
        />
        <MarkdownViewer index={index} />
      </div>
      {getErrorMessage("desc")}

      {/* Grade Input */}
      <input
        type="number"
        className="border-2 border-emerald-300 rounded p-3 w-full mb-4 focus:outline-none focus:border-emerald-500"
        {...register(`questions.${index}.grade`, {
          required: "Grade is required",
          min: { value: 1, message: "Grade must be greater than 0" },
          valueAsNumber: true,
        })}
        placeholder={`Question ${index + 1} Grade`}
      />
      {getErrorMessage("grade")}

      {/* Boilerplate Code */}
      <div className="boilerplate-code-container mb-6">
        <h3 className="text-lg font-bold tracking-widest mb-2">
          Boiler Plate Code
        </h3>
        <CodeInputs
          codeData={codeData || { body: "", language: "", version: "" }}
          onChange={handleCodeChange}
        />
        {getErrorMessage("code")}
      </div>

      {/* Test Cases */}
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
                  required: "Input is required",
                  minLength: { value: 1, message: "Input cannot be empty" },
                })}
              />
              {errors?.questions?.[index]?.testCases?.[tIndex]?.input && (
                <p className="text-red-600 mt-1">
                  {errors.questions[index].testCases[tIndex].input.message}
                </p>
              )}

              <input
                type="text"
                placeholder="Output"
                className="border-2 border-emerald-300 rounded p-3 w-full focus:outline-none focus:border-emerald-500"
                {...register(`questions.${index}.testCases.${tIndex}.output`, {
                  required: "Output is required",
                  minLength: { value: 1, message: "Output cannot be empty" },
                })}
              />
              {errors?.questions?.[index]?.testCases?.[tIndex]?.output && (
                <p className="text-red-600 mt-1">
                  {errors.questions[index].testCases[tIndex].output.message}
                </p>
              )}
            </div>

            <button
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md transition text-sm w-full disabled:bg-gray-400"
              onClick={() => remove(tIndex)}
              type="button"
              disabled={fields.length <= 1}
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
