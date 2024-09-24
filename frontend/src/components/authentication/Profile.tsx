import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "../../styles/profile.css";
import elon from "../../images/elon.png";
import UserData from "../useUserContext";

const Profile: React.FC = () => {
  // const { user, accessToken } = UserData();  uncheck these if u want to add user data !!!
  return (
    <section className="h-100 gradient-custom-6">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center">
          <div className="col col-lg-9 col-xl-8">
            <div className="card">
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: "#FFFFFF", height: "200px" }}
              >
                <div
                  className="ms-4 mt-5 d-flex flex-column"
                  style={{ width: "150px" }}
                >
                  <img
                    src={elon}
                    alt="Generic placeholder"
                    className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ width: "150px", zIndex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-dark text-body"
                    style={{ zIndex: 1 }}
                  >
                    Edit profile
                  </button>
                </div>
                <div className="ms-3" style={{ marginTop: "130px" }}>
                  <h5 style={{ color: "black" }}>Hossam Musk</h5>
                  <p style={{ color: "black" }}>Billionaire</p>
                </div>
              </div>
              <div className="p-4 text-black bg-body-tertiary">
                <div className="d-flex justify-content-end text-center py-1 text-body">
                  <div>
                    <p className="mb-1 h5">100</p>
                    <p className="small text-muted mb-0">Exams Taken</p>
                  </div>
                  <div className="px-3">
                    <p className="mb-1 h5">500</p>
                    <p className="small text-muted mb-0">Followers</p>
                  </div>
                  <div>
                    <p className="mb-1 h5">150</p>
                    <p className="small text-muted mb-0">Following</p>
                  </div>
                </div>
              </div>
              <div className="card-body p-4 text-black">
                <div className="mb-5 text-body">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4 bg-body-tertiary">
                    <p className="font-italic mb-1">Web Developer</p>
                    <p className="font-italic mb-1">Lives in New york city</p>
                    <p className="font-italic mb-0">Team Player</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 text-body">
                  <p className="lead fw-normal mb-0">Recent Exams</p>
                  <p className="mb-0">
                    <a href="#!" className="text-muted">
                      Show all
                    </a>
                  </p>
                </div>
                <div className="row g-2">
                  <div className="col mb-2">
                    <div
                      className="score-card"
                      style={{
                        margin: "50px auto",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E0E0E0",
                        color: "#333333",
                      }}
                    >
                      <h1
                        className="score-header"
                        style={{
                          textAlign: "center",
                          marginBottom: "20px",
                          color: "#5B5B5B",
                        }}
                      >
                        Exam 10289
                      </h1>
                      <h3 style={{ color: "#4A4A4A" }}>
                        Total Score: <span id="totalScore">100</span>
                      </h3>
                      <h4 style={{ color: "#4A4A4A" }}>Questions:</h4>
                      <div className="question" style={{ margin: "10px 0" }}>
                        <p style={{ color: "#4A4A4A" }}>
                          1. Question Type: <strong>Multiple Choice</strong>
                        </p>
                        <p style={{ color: "#4A4A4A" }}>
                          Number of Questions: <span id="score1">100</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div
                      className="score-card"
                      style={{
                        margin: "50px auto",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        background: "linear-gradient(135deg, #FF6F61, #6A82FB)",
                        color: "white",
                      }}
                    >
                      <h1
                        className="score-header"
                        style={{ textAlign: "center", marginBottom: "20px" }}
                      >
                        Exam 10290
                      </h1>
                      <h3>
                        Total Score: <span id="totalScore">99</span>
                      </h3>
                      <h4>Questions:</h4>
                      <div className="question" style={{ margin: "10px 0" }}>
                        <p>
                          1. Question Type: <strong>Multiple Choice</strong>
                        </p>
                        <p>
                          Number of Questions <span id="score1">100</span>
                        </p>
                      </div>
                    </div>
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

export default Profile;
