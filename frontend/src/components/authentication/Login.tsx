import React, { useState } from "react";
import "../../styles/login.css";
import Logo from "../../images/quizme-high-resolution-logo-transparent (1).png";
// import { axiosInstance } from "../../utils/axiosInstance";

import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import axios from "axios";

const LoginForm: React.FC = () => {
  const { setUserData, axiosInstance } = useUserContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      console.log("Login successful", response.data);
      setUserData(
        response.data.username,
        response.data.access_token,
        response.data.refresh_token
      );
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };
  return (
    <section className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-full max-w-4xl">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="md:flex">
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
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-6">
                      <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="text-center mb-6">
                      <button
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                        type="submit"
                      >
                        Log in
                      </button>
                      <a
                        className="text-blue-500 hover:underline mt-3 block"
                        href="#!"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <div className="flex justify-center">
                      <p className="mr-2">Don't have an account?</p>
                      <Link
                        to={"/register"}
                        className="text-red-500 hover:underline"
                      >
                        Create new
                      </Link>
                    </div>
                  </form>
                </div>

                <div className="md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 flex items-center">
                  <div>
                    <h4 className="mb-4 text-2xl font-bold">
                      More than an Examination Platform
                    </h4>
                    <p className="text-sm">We Are AI Powered</p>
                  </div>
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
