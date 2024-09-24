import React from "react";
import axiosInstance from "./utils/axiosInterceptors";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllQuestionsPage from "./components/Viewers/AllQuestionsPage";
import ExamCreationForm from "./components/Forms/ExamCreationForm";
import QuestionBank from "./components/Viewers/QuestionBank";
import Login from "./components/authentication/Login.tsx";
import Profile from "./components/authentication/Profile.tsx";
import { UserProvider } from "./components/UserContext.tsx";
import RegisterForm from "./components/authentication/Register.tsx";

const App: React.FC = () => {
  //   React.useEffect(() => {
  //     axiosInstance;
  //   }, []);

  return (
    <UserProvider>
      <Router>
        <>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/create-exam" Component={ExamCreationForm} />
            <Route path="/all-questions" Component={AllQuestionsPage} />
            <Route path="/question-bank" Component={QuestionBank} />
          </Routes>
        </>
      </Router>
    </UserProvider>
  );
};

export default App;
