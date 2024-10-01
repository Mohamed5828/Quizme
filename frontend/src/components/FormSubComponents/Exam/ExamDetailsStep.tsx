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
    watch,
  } = useFormContext<ExamDetailsFormData>();

   // Watch for changes to the start date and duration
   const startDate = watch("startDate");
   const duration = watch("duration");
 
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

  useEffect(() => {
    if (startDate && duration) {
      const startDateObj = new Date(startDate);
      
      const startTimestamp = startDateObj.getTime();
  
      const durationInMinutes = Number(duration);
  
      const expirationTimestamp = startTimestamp + durationInMinutes * 60000; 
  
      // Create a new date object for expiration based on the local timestamp
      const expirationDateObj = new Date(expirationTimestamp);
  
      // Format the expiration date to match the input's expected format (local time)
      const year = expirationDateObj.getFullYear();
      const month = String(expirationDateObj.getMonth() + 1).padStart(2, '0'); 
      const day = String(expirationDateObj.getDate()).padStart(2, '0');
      const hours = String(expirationDateObj.getHours()).padStart(2, '0');
      const minutes = String(expirationDateObj.getMinutes()).padStart(2, '0');
  
      const localExpirationDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  
      setValue("expirationDate", localExpirationDate);
    }
  }, [startDate, duration, setValue]);

  return (
    <>
      <div className="flex flex-wrap gap-4 [&>*]:flex-grow">
        <label>
          Exam Code *
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
          Group Name
          <br />
          <input
            type="text"
            placeholder="Group Name"
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            {...register("examCode", { required: false })}
          />
          {errors.examCode && (
            <p className="text-red-600">This field is not required</p>
          )}
        </label>
        <label>
          Duration in minutes *
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
          Max Grade *
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
          Start Date *
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
          Expiration Date *
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
