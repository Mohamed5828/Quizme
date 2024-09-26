import React, { useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import "../../styles/profile.css";
import { useUserContext } from "../UserContext";
import ProfileForm from "../Forms/ProfileForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
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
            axiosInstance
              .post("http://127.0.0.1:8000/api/v1/auth/logout/", {
                refresh: refreshToken,
              })
              .then(() => {
                toast.success("Logged out successfully");
                // localStorage.clear();
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                setUserData(null, null, null);
                navigate("/");
              })
              .catch((error) => {
                toast.error(error.response.data.message);
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
