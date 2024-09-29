import React, { useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import "../../styles/profile.css";
import ProfileForm from "../Forms/ProfileForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAxiosInstance } from "../../utils/axiosInstance";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";

export interface User {
  email: string;
  username: string;
  id: number;
  role: "student" | "instructor";
}
const Profile: React.FC = () => {
  const auth: User | null = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();

  console.log(auth); //user info
  console.log(authHeader); //bearer
  console.log(isAuthenticated); //boolean
  const axiosInstance = getAxiosInstance();

  const navigate = useNavigate();
  // TODO add profile editing functionalities
  useEffect(() => {
    if (!auth) {
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
              .post("/auth/logout/")
              .then(() => {
                signOut();
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
      <ProfileForm {...auth} />
    </main>
  );
};

export default Profile;
