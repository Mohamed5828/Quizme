import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import "../../styles/register.css";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    category: "",
    termsAccepted: false,
    role: "",
  });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields: (keyof typeof formData)[] = [
      "username",
      "email",
      "password1",
      "password2",
      "category",
      "role",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordStrengthRegex.test(formData.password1)) {
      toast.error(
        "Password must be at least 6 characters long and include both letters and numbers"
      );
      return;
    }

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
          category: formData.category,
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
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-30 
              ${i % 2 === 0 ? "bg-emerald-300" : "bg-teal-300"}
              rounded-full blur-xl
              ${i % 3 === 0 ? "w-72 h-72" : "w-96 h-96"}`}
            style={{
              left: `${0.8 * 100}%`,
              top: `${0.5 * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${10 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white/90 shadow-2xl rounded-2xl p-8 transform transition-all duration-300 ">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-8 h-8 text-emerald-500 " />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Join Quizme
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 placeholder:text-emerald-300"
                  placeholder="Choose your username"
                  value={formData.username}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 placeholder:text-emerald-300"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword1 ? "text" : "password"}
                      id="password1"
                      className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                      placeholder="Create a strong password"
                      value={formData.password1}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword1 ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-700 font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword2 ? "text" : "password"}
                      id="password2"
                      className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                      placeholder="Repeat your password"
                      value={formData.password2}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword2 ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  id="category"
                  className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 placeholder:text-emerald-300"
                  placeholder="Enter your category"
                  value={formData.category}
                  onChange={handleChange}
                />

                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-emerald-700"
                >
                  <option value="">Select your role</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Student</option>
                </select>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-emerald-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <label htmlFor="termsAccepted" className="text-emerald-700">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-emerald-500 hover:text-emerald-600 underline"
                    >
                      Terms of Service
                    </Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-medium
                  transform transition-all duration-300  hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              >
                Create Account
              </button>

              <p className="text-center text-emerald-700">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-emerald-500 hover:text-emerald-600 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
