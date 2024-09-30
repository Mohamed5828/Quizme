import React, { useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import "../../styles/profile.css";
import ProfileForm from "../Forms/ProfileForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { useUserContext } from "../../../context/UserContext";

export interface User {
  email: string;
  username: string;
  id: number;
  role: "student" | "instructor";
}
const Profile: React.FC = () => {
  const { logout, user } = useUserContext();
  const axiosInstance = getAxiosInstance();

  const navigate = useNavigate();
  return (
    <main className="container mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold tracking-widest">Profile</h1>
        <button
          className="bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition-colors duration-200"
          onClick={() => {
            logout();
            axiosInstance
              .post("/auth/logout/")
              .then(() => {
                toast.success("Logged out successfully");
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
