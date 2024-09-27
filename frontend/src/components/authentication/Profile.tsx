import React, { useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import "../../styles/profile.css";
import { useUserContext } from "../../../context/UserContext";
import ProfileForm from "../Forms/ProfileForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAxiosInstance } from "../../utils/axiosInstance";

const Profile: React.FC = () => {
  const { user, refreshToken, setUserData } = useUserContext();

  const navigate = useNavigate();
  // TODO add profile editing functionalities
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to view this page");
      navigate("/login");
    }
  });
  return (
    <main className="container mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold tracking-widest">Profile</h1>
        <button
          className="bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition-colors duration-200"
          onClick={() => {
            const axiosInstance = getAxiosInstance("v1");
            axiosInstance
              .post("/auth/logout/", {
                refresh: refreshToken,
              })
              .then(() => {
                toast.success("Logged out successfully");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                setUserData(null, null, null);
                navigate("/");
              })
              .catch((error) => {
                toast.error(
                  error.response?.data?.message ||
                    "Logout failed. Please try again."
                );
              });
          }}
        >
          Logout
        </button>
      </div>
      <ProfileForm {...user} />
    </main>
  );
};

export default Profile;
