import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import "../../styles/register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAxiosInstance } from "../../utils/axiosInstance";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    termsAccepted: false,
    role: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("You must accept the terms of service");
      return;
    }

    const axiosInstance = getAxiosInstance();
    try {
      const response = await axiosInstance.post(
        "/auth/register/",
        {
          username: formData.username,
          email: formData.email,
          password1: formData.password1,
          password2: formData.password2,
          role: formData.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Registration successful");
      navigate("/login");
      console.log("Registration successful", response.data);
    } catch (error) {
      console.error("Error during registration", error);
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  return (
    <section
      className="min-h-screen bg-cover bg-center"
      // style={{
      //   backgroundImage:
      //     "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      // }}
    >
      <div className="bg-white bg-opacity-50 min-h-screen flex items-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-lg">
              <div className="bg-Cultured shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Create an account
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <input
                      type="text"
                      id="username"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Your Username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="password"
                      id="password1"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Password"
                      value={formData.password1}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="password"
                      id="password2"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Repeat your password"
                      value={formData.password2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 mb-2">
                      Who are you?
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select your role</option>
                      <option value="instructor">Instructor</option>
                      <option value="student">Student</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-center mb-6">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="termsAccepted" className="text-gray-600">
                      I agree to all statements in{" "}
                      <a href="#!" className="text-blue-500 hover:underline">
                        Terms of service
                      </a>
                    </label>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Register
                    </button>
                  </div>

                  <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link
                      to={"/login"}
                      className="text-blue-500 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
