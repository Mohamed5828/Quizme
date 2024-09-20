import { useFormContext } from "react-hook-form";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
const ReviewStep = () => {
  const { getValues } = useFormContext();
  const formData = getValues();
  return (
    <>
      <h2 className="text-xl font-bold tracking-widest">Review</h2>
      <p className="text-gray-500">Please review your exam details</p>
      <JsonView src={formData} />
    </>
  );
};

export default ReviewStep;
