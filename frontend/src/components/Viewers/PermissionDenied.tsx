import React from "react";
import { useNavigate } from "react-router-dom";
import forbiddenImage from "../../images/403.png";

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  // Function to handle navigation back to the home page
  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-red-100 flex items-center justify-center min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <img
          src={forbiddenImage}
          alt="403 Forbidden"
          className="mx-auto my-6 rounded-lg shadow-sm w-2/3"
        />
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          403 - Forbidden
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Sorry, you do not have permission to access this page.
        </p>
        <button
          onClick={goHome}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
