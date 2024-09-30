import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const ParticipantsStep = () => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext();

  const participants = watch("participants");

  useEffect(() => {
    // Initialize participants as an empty array if it's not set
    if (!getValues("participants")) {
      setValue("participants", []);
    }
  }, []);

  const handleParticipantsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const participantsArray = e.target.value.split(/[\s\n]+/).filter(Boolean);
    setValue("participants", participantsArray, { shouldValidate: true });
  };

  return (
    <>
      <h2 className="text-xl font-bold tracking-widest">Whitelist</h2>
      <p className="text-gray-500">
        Enter the email of participants you want to whitelist
      </p>
      <p className="text-gray-500">
        Wildcards are supported (e.g. *@example.com)
      </p>
      <p className="text-gray-500">
        Separate multiple emails with a space or newline
      </p>
      <p className="text-gray-500">Use * to whitelist everyone</p>
      <p className="text-gray-500">
        Note: Only participants who are whitelisted will be able to join the
        exam
      </p>
      <textarea
        className="border-2 border-gray-300 rounded p-2 w-full h-40"
        {...register("participantsInput", { required: true, minLength: 1 })}
        onChange={handleParticipantsChange}
        defaultValue={
          Array.isArray(participants) ? participants.join("\n") : ""
        }
      ></textarea>
      {errors.participantsInput && (
        <p className="text-red-500">This field is required</p>
      )}
      {Array.isArray(participants) && participants.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Current participants:</h3>
          <ul className="list-disc list-inside">
            {participants.map((participant: string, index: number) => (
              <li key={index} className="text-gray-700">
                {participant}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ParticipantsStep;
