import React from "react";
import { useNavigate } from "react-router-dom";
import notFoundImage from "../../images/404.jpg";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-blue-100 flex items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <img
          src={notFoundImage}
          alt="404 Not Found"
          className="mx-auto my-6 rounded-lg shadow-sm w-2/3"
        />
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <button
          onClick={goHome}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
