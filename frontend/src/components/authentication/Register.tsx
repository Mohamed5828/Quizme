import React, { useState } from "react";
import axios from "axios";
import "../../styles/register.css";
import { Link } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    termsAccepted: false,
  });

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
      alert("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      alert("You must accept the terms of service");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/register/",
        {
          username: formData.username,
          email: formData.email,
          password1: formData.password1,
          password2: formData.password2,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful", response.data);
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Create an account
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="username"
                        className="form-control form-control-lg"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <label className="form-label" htmlFor="username">
                        Your UserName
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <label className="form-label" htmlFor="email">
                        Your Email
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="password1"
                        className="form-control form-control-lg"
                        value={formData.password1}
                        onChange={handleChange}
                      />
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="password2"
                        className="form-control form-control-lg"
                        value={formData.password2}
                        onChange={handleChange}
                      />
                      <label className="form-label" htmlFor="confirmPassword">
                        Repeat your password
                      </label>
                    </div>

                    <div className="form-check d-flex justify-content-center mb-5">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="termsAccepted"
                      >
                        I agree to all statements in{" "}
                        <a href="#!" className="text-body">
                          <u>Terms of service</u>
                        </a>
                      </label>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Already have an account?{" "}
                      <Link to={"/login"} className="fw-bold text-body">
                        <u>Login here</u>
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
