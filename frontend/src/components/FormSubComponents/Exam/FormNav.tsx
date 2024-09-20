interface FormNavProps {
  step: number;
  maxSteps: number;
  handleNext: () => void;
  handlePrev: () => void;
}

const FormNav = ({ step, maxSteps, handleNext, handlePrev }: FormNavProps) => {
  return (
    <div className="justify-between flex gap-4 [&_button]:w-1/4 bg-gray-100 p-4 rounded-lg">
      {step > 1 ? (
        <button
          className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition"
          onClick={handlePrev}
          type="button"
        >
          Prev
        </button>
      ) : (
        <button className="text-gray-500" type="button" disabled>
          Prev
        </button>
      )}
      {step < maxSteps ? (
        <button
          className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition"
          onClick={handleNext}
          type="button"
        >
          Next
        </button>
      ) : (
        <button
          className="bg-gray-950 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition"
          type="submit"
        >
          Confirm
        </button>
      )}
    </div>
  );
};

export default FormNav;
