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
        response.data.tokens.access,
        response.data.tokens.refresh
      );
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <section
      className="h-100 gradient-form"
      style={{ backgroundColor: "#eee" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img src={Logo} style={{ width: "185px" }} alt="logo" />
                      <h4 className="mt-1 mb-5 pb-1">
                        Your ultimate Examination Platform
                      </h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <p>Please login to your account</p>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="email"
                          className="form-control"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <label className="form-label" htmlFor="email">
                          email
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          className="btn btn-primary login-btn btn-block fa-lg gradient-custom-9 mb-3"
                          type="submit"
                        >
                          Log in
                        </button>
                        <a className="text-muted" href="#!">
                          Forgot password?
                        </a>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <Link
                          to={"/register"}
                          className="btn btn-outline-danger"
                        >
                          Create new
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">More than an Examination Platform</h4>
                    <p className="small mb-0">We Are AI Powered</p>
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
