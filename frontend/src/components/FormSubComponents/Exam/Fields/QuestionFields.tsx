import { useFormContext } from "react-hook-form";
import MCQFields from "./MCQFields";
import CodingFields from "./CodingFields";
import React from "react";

export interface QuestionFieldsProps {
  index: number;
}

const QuestionFields = React.memo(({ index }: QuestionFieldsProps) => {
  const { watch } = useFormContext();

  const questionType = watch(`questions.${index}.type`);
  return (
    <>
      {questionType === "mcq" && <MCQFields index={index} />}
      {questionType === "code" && <CodingFields index={index} />}
    </>
  );
});

export default QuestionFields;
