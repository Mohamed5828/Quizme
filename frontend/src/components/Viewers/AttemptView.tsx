import { useEffect } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import { useParams } from "react-router-dom";
import BasicSpinner from "../Basic/BasicSpinner";
import { toast } from "react-toastify";

const AttemptViewer = () => {
  const { attempt_id } = useParams();
  const { data, loading, error, refetch } = useFetchData(
    `/attempts/${attempt_id}/`
  );

  useEffect(() => {
    refetch();
  }, [attempt_id, refetch]);

  if (loading) {
    return <BasicSpinner />;
  } else if (error) {
    toast.error(error.message);
  } else if (!data) {
    toast.error("No data found");
  } else {
    return (
      <p>{JSON.stringify({ data, loading, error, refetch })}</p>
      // TODO properly display attempts
      // <QuestionContainer
      //   userAnswers={data["answers"]}
      //   setUserAnswers={() => {}}
      // />
    );
  }
};

export default AttemptViewer;
