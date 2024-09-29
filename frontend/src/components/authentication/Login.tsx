import React, { useState } from "react";
import "../../styles/login.css"; // Ensure you add the custom styles here
import Logo from "../../images/quizme-high-resolution-logo (1).png";
import loginpic from "../../images/loginpic.jpg";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAxiosInstance } from "../../utils/axiosInstance";
import useSignIn from "react-auth-kit/hooks/useSignIn";

const LoginForm: React.FC = () => {
  const signIn = useSignIn();
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

    const axiosInstance = getAxiosInstance("v1");
    try {
      const response = await axiosInstance.post("/auth/login/", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Login successful", response.data);
      toast.success("Login successful");

      if (
        signIn({
          auth: {
            token: response.data.accesstoken,
            type: "Bearer",
          },
          // refresh: response.data.refresh_token,
          userState: response.data.user,
        })
      ) {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
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
                      <div>
                        <button
                          onClick={() => navigate("/Forgot-password")}
                          className="text-emerald-500 hover:underline mt-3 block"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>

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
