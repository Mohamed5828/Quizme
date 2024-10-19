import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Oval } from 'react-loader-spinner';

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

  return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <p style={{ fontSize: '18px', marginBottom: '20px' }}>Verifying email...</p>
    <Oval 
      color="#00BFFF" 
      height={80} 
      width={80} 
      secondaryColor="#f0f0f0" 
      ariaLabel="loading"
    />
  </div>);
};

export default EmailVerification;
