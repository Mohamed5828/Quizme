interface FormStepperProps {
  steps: { index: number; name: string; body: JSX.Element }[];
  step?: number;
}

const FormStepper = ({ steps, step = 1 }: FormStepperProps) => {
  return (
    <>
      <ol className="flex w-full items-center rounded-lg border p-3 text-center text-sm font-medium text-gray-400 shadow-sm space-x-2 rtl:space-x-reverse sm:space-x-4 sm:p-4 sm:text-base flex-wrap">
        {steps.map((currStep) => (
          <li
            key={currStep.index}
            className={`flex items-center ${step >= currStep.index && "text-black"}`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-500 ${step >= currStep.index && "border-black"} text-xs me-2`}
            >
              {currStep.index}
            </span>
            {currStep.name}
            {currStep.index < steps.length && (
              <svg
                className="h-3 w-3 rtl:rotate-180 ms-2 sm:ms-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m7 9 4-4-4-4M1 9l4-4-4-4"
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </>
  );
};
export default FormStepper;
