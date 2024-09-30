import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

interface ExamDetailsFormData {
  examCode: string;
  duration: number;
  maxGrade: number;
  startDate: string;
  expirationDate: string;
}

const ExamDetailsStep: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<ExamDetailsFormData>();

  // Ensure the start date is not in the past
  const validateStartDate = (value: string): string | boolean => {
    const currentDate = new Date();
    const startDate = new Date(value);
    return startDate >= currentDate || "Start date cannot be in the past";
  };

  // Ensure expiration date is after the start date
  const validateExpirationDate = (value: string): string | boolean => {
    const startDate = new Date(getValues("startDate"));
    const expirationDate = new Date(value);
    return (
      expirationDate > startDate ||
      "Expiration date must be after the start date"
    );
  };

  // Automatically reset the expiration date if the start date changes
  useEffect(() => {
    const startDate = getValues("startDate");
    if (startDate) {
      setValue("expirationDate", "");
    }
  }, [getValues("startDate"), setValue]);

  return (
    <>
      <div className="flex flex-wrap gap-4 [&>*]:flex-grow">
        <label>
          Exam Code
          <br />
          <input
            type="text"
            placeholder="Exam Code"
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            {...register("examCode", { required: true })}
          />
          {errors.examCode && (
            <p className="text-red-600">This field is required</p>
          )}
        </label>
        <label>
          Duration in minutes
          <br />
          <input
            type="number"
            placeholder="Duration in minutes"
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            {...register("duration", {
              required: true,
              max: 240,
              min: 15,
            })}
          />
          {errors.duration && (
            <p className="text-red-600">
              Duration must be between 15 and 240 minutes
            </p>
          )}
        </label>
        <label>
          Max Grade
          <br />
          <input
            type="number"
            placeholder="Max Grade"
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            {...register("maxGrade", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
          />
          {errors.maxGrade && (
            <p className="text-red-600">Max Grade must be greater than 0</p>
          )}
        </label>
      </div>
      <div className="flex flex-wrap gap-4 [&>*]:flex-grow mt-4">
        <label>
          Start Date
          <br />
          <input
            type="datetime-local"
            placeholder="Start Date"
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            {...register("startDate", {
              required: true,
              validate: validateStartDate,
            })}
          />
          {errors.startDate && (
            <p className="text-red-600">{errors.startDate.message}</p>
          )}
        </label>
        <label>
          Expiration Date
          <br />
          <input
            type="datetime-local"
            placeholder="Expiration Date"
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            {...register("expirationDate", {
              required: true,
              validate: validateExpirationDate,
            })}
          />
          {errors.expirationDate && (
            <p className="text-red-600">{errors.expirationDate.message}</p>
          )}
        </label>
      </div>
    </>
  );
};

export default ExamDetailsStep;
