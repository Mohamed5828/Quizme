import { useForm, FormProvider, FieldValues } from "react-hook-form";
import FormStepper from "../FormSubComponents/Exam/FormStepper.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import {
  incrementStep,
  decrementStep,
  resetStep,
} from "../../state/ExamCreationState/ExamCreationSlice.ts";

import ExamDetailsStep from "../FormSubComponents/Exam/ExamDetailsStep.tsx";
import QuestionsStep from "../FormSubComponents/Exam/QuestionsStep.tsx";
import ReviewStep from "../FormSubComponents/Exam/ReviewStep.tsx";
import ParticipantsStep from "../FormSubComponents/Exam/ParticipantsStep.tsx";
import FormNav from "../FormSubComponents/Exam/FormNav.tsx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { User } from "../authentication/Profile.tsx";
import { useUserContext } from "../../../context/UserContext.tsx";
import postData from "../../utils/postData.ts";

const STEPS = [
  { index: 1, name: "Exam Details", body: <ExamDetailsStep /> },
  { index: 2, name: "Questions", body: <QuestionsStep /> },
  { index: 3, name: "Participants", body: <ParticipantsStep /> },
  { index: 4, name: "Review", body: <ReviewStep /> },
];

interface ExamCreationFormProps {
  defaultValues?: FieldValues;
}

const ExamCreationForm = ({ defaultValues = {} }: ExamCreationFormProps) => {
  const { user } = useUserContext();
  const auth: User | null = user;

  const navigate = useNavigate();

  const step = useSelector((state: RootState) => state.ExamCreationState.step);
  const dispatch = useDispatch();

  const methods = useForm({
    defaultValues,
  });

  const handleNext = async (e: React.FormEvent) => {
    const isStepValid = await methods.trigger();
    if (isStepValid) {
      dispatch(incrementStep(STEPS.length));
    }
    e.preventDefault();
  };

  const handlePrev = () => {
    dispatch(decrementStep());
  };

  // TODO: Connect to submit endpoint
  const handleSubmit = async (data: FieldValues) => {
    try {
      const { participantsInput, ...restData } = data;
      restData.startDate = new Date(restData.startDate).toISOString();
      restData.expirationDate = new Date(restData.expirationDate).toISOString();
      console.log("Exam created:", await postData("/exams/", restData, "v2"));
      toast.success("Exam created successfully!");
      dispatch(resetStep());
      navigate("/dashboard");
    } catch (error) {
      toast.error(`An error occurred while creating the exam. Error: ${error}`);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetStep());
    };
  }, [dispatch]);
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="container flex flex-col p-4 shadow-2xl [&_label]:mb-2 [&_input]:w-full [&_input]:p-2 [&_label]:text-sm [&_label]:text-gray-500 [&_label]:border-2 [&_label]:border-gray-300 [&_label]:rounded [&_label]:p-4 [&_input]:border-1 [&_input]:shadow-sm [&_input]:rounded space-y-5"
      >
        <h1 className="text-2xl font-bold tracking-widest capitalize">
          CREATE EXAM
        </h1>
        <FormStepper steps={STEPS} step={step} />
        {STEPS[step - 1].body}
        <FormNav
          step={step}
          maxSteps={STEPS.length}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      </form>
    </FormProvider>
  );
};

export default ExamCreationForm;
