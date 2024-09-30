import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllQuestionsPage from "./components/Viewers/AllQuestionsPage";
import ExamCreationForm from "./components/Forms/ExamCreationForm";
import QuestionBank from "./components/Viewers/QuestionBank";
import Login from "./components/authentication/Login.tsx";
import Profile from "./components/authentication/Profile.tsx";
import RegisterForm from "./components/authentication/Register.tsx";
import WebcamMonitorWrapper from "./components/Wrappers/WebcamMonitorWrapper.tsx";
import Dashboard from "./components/dashboard/Dashboard.tsx";
import HomeLayout from "./layouts/HomeLayout.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./components/Landing/LandingPage.tsx";
import AttemptView from "./components/Viewers/AttemptView.tsx";
import ExamAllStudent from "./components/ExamResults/ExamAllStudent.tsx";
import AllExams from "./components/ExamResults/AllExams.tsx";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import Navbar from "./components/navbar.tsx";
import ForgotPassword from "./components/authentication/ForgotPassword.tsx";
import ChangePassword from "./components/authentication/ResetPassword.tsx";
// import refresh from "./components/authentication/refresh.ts";

const App: React.FC = () => {
  const store = createStore({
    authName: "_auth",
    authType: "localstorage",
  });
  return (
    <AuthProvider store={store}>
      <Router>
        <Navbar />
        {/* <HomeLayout> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<Landing />} />
          <Route path="/create-exam" Component={ExamCreationForm} />
          <Route path="/Forgot-password" element={<ForgotPassword />}/>
          <Route path="/api/v1/auth/reset-password/:uidb64/:token" element={<ChangePassword />}/>
          
          <Route
            path="/all-questions"
            element={
              <WebcamMonitorWrapper>
                <AllQuestionsPage />
              </WebcamMonitorWrapper>
            }
          />
          <Route path="/question-bank" Component={QuestionBank} />
          <Route path="/exam-result/:examCode" Component={ExamAllStudent} />
          <Route path="/exams" Component={AllExams} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attempt/:attempt_id" element={<AttemptView />} />
        </Routes>
        <ToastContainer position="bottom-right" />
        {/* </HomeLayout> */}
      </Router>
    </AuthProvider>
  );
};

export default App;
