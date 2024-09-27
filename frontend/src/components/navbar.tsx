import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

import { useUserContext } from "../../context/UserContext";
const HOME_NAV = {
  name: "Home",
  path: "/",
};
const PROFILE_NAV = {
  name: "Profile",
  path: "/profile",
};

const LOGIN_NAV = {
  name: "Login",
  path: "/login",
};
const REGISTER_NAV = {
  name: "Register",
  path: "/register",
};

const QUESTIONBANK_NAV = {
  name: "Question Bank",
  path: "/question-bank",
};

const CREATEEXAM_NAV = {
  name: "Create Exam",
  path: "/create-exam",
};

const NAV_LOGGED_IN_STUDENT = [HOME_NAV, PROFILE_NAV];

const NAV_LOGGED_IN_INSTRUCTOR = [
  HOME_NAV,
  QUESTIONBANK_NAV,
  CREATEEXAM_NAV,
  PROFILE_NAV,
];

const NAV_LOGGED_OUT = [HOME_NAV, LOGIN_NAV, REGISTER_NAV];
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUserContext();
  const isAuthenticated = user ? true : false;

  return (
    <nav
  style={{
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }}
  className="bg-white-200 flex flex-col px-4 py-2 sm:px-6 lg:px-8"
>
  <div className="flex justify-between mx-auto max-w-7xl  w-full">
    <Link to="/" className="text-4xl font-bold text-gray-1000">
      Quizme
    </Link>
    <ul className="hidden sm:flex items-center">
      {isAuthenticated
        ? user?.role === "student"
          ? NAV_LOGGED_IN_STUDENT.map((item) => (
              <li key={item.name} className="mx-2">
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))
          : NAV_LOGGED_IN_INSTRUCTOR.map((item) => (
              <li key={item.name} className="mx-2">
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))
        : NAV_LOGGED_OUT.map((item) => (
            <li key={item.name} className="mx-2">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
    </ul>
    <button
      className="sm:hidden flex items-center border rounded text-xl text-gray-600 hover:text-gray-800"
      onClick={() => setIsOpen(!isOpen)}
    >
      <svg
        className="fill-current h-6 w-6"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Menu</title>
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0V15z" />
      </svg>
    </button>
  </div>
  <div
    className={`${
      isOpen ? "block" : "hidden"
    } sm:hidden flex flex-col w-full transition-all duration-300 ease-in-out bg-gray-400 px-2 py-1 rounded-lg ${
      isOpen ? "max-h-screen" : "max-h-0"
    }`}
  >
    <ul>
      {isAuthenticated
        ? user?.role === "student"
          ? NAV_LOGGED_IN_STUDENT.map((item) => (
              <Link to={item.path}>
                <li
                  key={item.name}
                  className="my-1 hover:text-gray-800 hover:bg-gray-200 rounded p-2 transition"
                >
                  {item.name}
                </li>
              </Link>
            ))
          : NAV_LOGGED_IN_INSTRUCTOR.map((item) => (
              <Link to={item.path}>
                <li
                  key={item.name}
                  className="my-1 hover:text-gray-800 hover:bg-gray-200 rounded p-2 transition"
                >
                  {item.name}
                </li>
              </Link>
            ))
        : NAV_LOGGED_OUT.map((item) => (
            <Link to={item.path}>
              <li
                key={item.name}
                className="my-1 hover:text-gray-800 hover:bg-gray-200 rounded p-2 transition"
              >
                {item.name}
              </li>
            </Link>
          ))}
    </ul>
  </div>
</nav>

  );
};

export default Navbar;
