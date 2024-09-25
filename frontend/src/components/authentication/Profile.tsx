import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "../../styles/profile.css";
import elon from "../../images/elon.png";

const Profile: React.FC = () => {
  // const { user, accessToken } = UserData();  uncheck these if u want to add user data !!!
  return (
    <section className="min-h-screen gradient-custom-6">
      <div className="container py-5 min-h-screen">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-white h-52 flex items-end p-4">
                <div className="relative -top-10">
                  <img
                    src={elon}
                    alt="Profile"
                    className="w-36 h-36 rounded-full border-4 border-white shadow-md"
                  />
                  <button className="mt-2 px-4 py-2 bg-transparent border border-gray-500 text-gray-600 rounded-lg hover:bg-gray-200">
                    Edit profile
                  </button>
                </div>
                <div className="ml-4 mb-3">
                  <h5 className="text-xl font-semibold text-black">
                    Hossam Musk
                  </h5>
                  <p className="text-sm text-gray-600">Billionaire</p>
                </div>
              </div>

              <div className="p-6 bg-gray-100">
                <div className="flex justify-end text-center space-x-6">
                  <div>
                    <p className="text-xl font-semibold">100</p>
                    <p className="text-sm text-gray-500">Exams Taken</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold">500</p>
                    <p className="text-sm text-gray-500">Followers</p>
                  </div>
                  <div>
                    <p className="text-xl font-semibold">150</p>
                    <p className="text-sm text-gray-500">Following</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white">
                <div className="mb-5">
                  <p className="text-lg font-semibold">About</p>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="italic">Web Developer</p>
                    <p className="italic">Lives in New York City</p>
                    <p className="italic">Team Player</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold">Recent Exams</p>
                  <a
                    href="#!"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Show all
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200">
                    <h1 className="text-center text-xl font-semibold text-gray-700 mb-4">
                      Exam 10289
                    </h1>
                    <h3 className="text-lg font-semibold text-gray-600">
                      Total Score: <span id="totalScore">100</span>
                    </h3>
                    <h4 className="text-md font-medium text-gray-600">
                      Questions:
                    </h4>
                    <p className="mt-2 text-gray-600">
                      1. Question Type: <strong>Multiple Choice</strong>
                    </p>
                    <p className="text-gray-600">
                      Number of Questions: <span id="score1">100</span>
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-red-400 to-blue-500 rounded-lg shadow-lg text-white">
                    <h1 className="text-center text-xl font-semibold mb-4">
                      Exam 10290
                    </h1>
                    <h3 className="text-lg font-semibold">
                      Total Score: <span id="totalScore">99</span>
                    </h3>
                    <h4 className="text-md font-medium">Questions:</h4>
                    <p className="mt-2">
                      1. Question Type: <strong>Multiple Choice</strong>
                    </p>
                    <p>
                      Number of Questions: <span id="score1">100</span>
                    </p>
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
