import { useFormContext } from "react-hook-form";

const ParticipantsStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <h2 className="text-xl font-bold tracking-widest">Whitelist</h2>
      <p className="text-gray-500">
        Enter the email of participants you want to whitelist
      </p>
      <p className="text-gray-500">
        Wildcards are supported (e.g. *@example.com)
      </p>
      <p className="text-gray-500">Separate multiple emails with a newline</p>
      <p className="text-gray-500">Use * to whitelist everyone</p>
      <p className="text-gray-500">
        Note: Only participants who are whitelisted will be able to join the
        exam
      </p>
      <textarea
        className="border-2 border-gray-300 rounded p-2 w-full h-40"
        {...register("participants", { required: true, minLength: 1 })}
      ></textarea>
      {errors.participants && (
        <p className="text-red-600">This field is required</p>
      )}
    </>
  );
};

export default ParticipantsStep;
