import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { useUserContext } from "./UserContext";
const NAV_LOGGED_IN = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Create Exam",
    path: "/create-exam",
  },
  {
    name: "Profile",
    path: "/profile",
  },
];

const NAV_LOGGED_OUT = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Login",
    path: "/login",
  },
  {
    name: "Register",
    path: "/register",
  },
];
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUserContext();
  const isAuthenticated = user ? true : false;
  console.log(user);

  return (
    <nav className="bg-gray-200 flex flex-col px-4 py-2 sm:px-6 lg:px-8">
      <div className="flex justify-between mx-auto max-w-7xl  w-full">
        <Link to="/" className="text-3xl font-bold text-gray-800">
          Quizme
        </Link>
        <ul className="hidden sm:flex items-center">
          {isAuthenticated
            ? NAV_LOGGED_IN.map((item) => (
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
        } sm:hidden flex flex-col w-full
        bg-gray-400 px-2 py-1 rounded-lg`}
      >
        <ul>
          {isAuthenticated
            ? NAV_LOGGED_IN.map((item) => (
                <li
                  key={item.name}
                  className="my-1 hover:text-gray-800 hover:bg-gray-200 rounded p-2 transition"
                >
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))
            : NAV_LOGGED_OUT.map((item) => (
                <li
                  key={item.name}
                  className="my-1 hover:text-gray-800 hover:bg-gray-200 rounded p-2 transition"
                >
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
