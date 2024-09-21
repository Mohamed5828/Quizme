import { useFormContext } from "react-hook-form";

const ExamDetailsStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className="flex flex-wrap gap-4 [&>*]:flex-grow">
        <label>
          Exam Title
          <br />
          <input
            type="text"
            placeholder="Exam Title"
            {...register("examTitle", { required: true })}
          />
          {errors.examTitle && (
            <p className="text-red-600">This field is required</p>
          )}
        </label>
        <label>
          Duration in minutes
          <br />
          <input
            type="number"
            placeholder="Duration in minutes"
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
          Max Score
          <br />
          <input
            type="number"
            placeholder="Max Score"
            {...register("maxScore", {
              required: true,
              min: 0,
            })}
          />
          {errors.duration && (
            <p className="text-red-600">max score must be greater than 0</p>
          )}
        </label>
      </div>
      <div className="flex flex-wrap gap-4 [&>*]:flex-grow">
        <label>
          Start Date
          <br />
          <input
            type="datetime-local"
            placeholder="startDate"
            {...register("startDate", { required: true })}
          />
          <br />
          {errors.startDate && (
            <p className="text-red-600">This field is required</p>
          )}
        </label>
        <label>
          Expiration Date
          <br />
          <input
            type="datetime-local"
            placeholder="Expiration Date"
            {...register("expirationDate", { required: true })}
          />
          {errors.expirationDate && (
            <p className="text-red-600">This field is required</p>
          )}
        </label>
      </div>
    </>
  );
};
export default ExamDetailsStep;
