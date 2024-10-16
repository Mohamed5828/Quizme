import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const EmailVerification: React.FC = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const axiosInstance = getAxiosInstance();
        await axiosInstance.get(`/auth/verify-email/${uid}/${token}`);
        toast.success("Email verification successful! You can now log in");
        navigate("/login");
      } catch (error) { 
        toast.error("Email verification failed. Please try again");
        navigate("/");
      }
    };
    if (uid && token) {
      verifyEmail();
    }
  }, [uid, token, navigate]);

  return <div>Verifying email...</div>;
};

export default EmailVerification;
