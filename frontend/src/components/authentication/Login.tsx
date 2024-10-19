import React, { useState } from "react";
import "../../styles/login.css"; // Ensure you add the custom styles here
import Logo from "../../images/quizme-high-resolution-logo (1).png";
import loginpic from "../../images/loginpic.jpg";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAxiosInstance } from "../../utils/axiosInstance";
import { useUserContext } from "../../../context/UserContext";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { isLoggedIn, user, accessToken, setUserData } = useUserContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const axiosInstance = getAxiosInstance("v1");
    try {
      const response = await axiosInstance.post("/auth/login/", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Login successful", response.data);
      toast.success("Login successful");
      setUserData(response.data.user, response.data.accessToken);
      console.log(user);
      console.log(accessToken);
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("username or password is not correct");
    }
  };

  return (
    <section className="min-h-screen bg-white-100">
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-full max-w-4xl">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="md:flex">
                {/* Left Section - Form */}
                <div className="md:w-1/2 p-8">
                  <div className="text-center">
                    <img src={Logo} className="w-48 mx-auto" alt="logo" />
                    <h4 className="mt-6 mb-5 text-xl font-semibold">
                      Your ultimate Examination Platform
                    </h4>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <p className="text-gray-600 mb-4">
                      Please login to your account
                    </p>

                    <div className="mb-4">
                      <input
                        type="text"
                        id="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-6">
                      <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="text-center mb-6">
                      <button
                        className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition-colors"
                        type="submit"
                      >
                        Log in
                      </button>
                      <a
                        className="text-emerald-500 hover:underline mt-3 block"
                        onClick={() => navigate("/Forgot-password")}
                      >
                        Forgot password?
                      </a>
                    </div>
                   
                    {/* <div className="px-6 sm:px-0 max-w-sm">
                    <button type="button" className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"><svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Sign up with Google<div></div></button>
                    </div> */}
                   
                    <div className="flex justify-center">
                      <p className="mr-2">Don't have an account?</p>
                      <Link
                        to={"/register"}
                        className="text-green-500 hover:underline"
                      >
                        Create new
                      </Link>
                    </div>
                  </form>
                </div>

                {/* Right Section - Wavy Line */}
                <div className="md:w-1/2 bg-white-500 text-white p-8 flex items-center relative">
                <img src={loginpic} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;

