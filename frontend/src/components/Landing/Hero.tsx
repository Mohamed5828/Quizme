
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import getScrollAnimation from '../../utils/ScrollAnimation';
import ScrollAnimationWrapper from "./AnimationWrapper";
import exam from '../../images/9233873_4119036.jpg';
import student from '../../images/student.png';
import institute from '../../images/education.png';
import country from '../../images/planet-earth.png';



interface User {
  name: string;
  number: string;
  icon: string;
}

interface HeroProps {
  listUser?: User[]; 
}

const Hero: React.FC<HeroProps> = ({
  listUser = [
    {
      name: "Institutes",
      number: "390",
      icon: institute,
    },
    {
      name: "Countries",
      number: "20",
      icon: country,
    },    
    {
      name: "Students",
      number: "2000",
      icon: student,
    },
  ],
}) => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto" id="about">
      <ScrollAnimationWrapper>
        <motion.div
          className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16"
          variants={scrollAnimation}
        >
          <div className="flex flex-col justify-center items-start row-start-2 sm:row-start-1">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-black-600 leading-normal">
              Want to test your current level? <strong>QuizMe</strong>. 
            </h1>
            <p className="text-black-500 mt-4 mb-6">
              We provide an awesome examination system with all sorts of monitoring to ensure a seamless exam experience.
            </p>
            <button className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 ease-in-out active:scale-105">
              Get Started
            </button>
          </div>  
          <div className="flex w-full">
            <motion.div className="h-full w-full" variants={scrollAnimation}>
              <img
                src={exam}
                alt="Exam Illustration"
                width={500}
                height={300}
              />
            </motion.div>
          </div>
        </motion.div>
      </ScrollAnimationWrapper>
      <div className="relative w-full flex">
        <ScrollAnimationWrapper
          className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white-500 z-10"
        >
          {listUser.map((listUsers, index) => (
            <motion.div
              className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
              key={index}
              custom={{ duration: 2 + index }}
              variants={scrollAnimation}
            >
              <div className="flex mx-auto w-40 sm:w-auto">
                <div className="flex items-center justify-center bg-white-100 w-12 h-12 mr-6 rounded-full">
                  <img src={listUsers.icon} className="h-6 w-6" alt={listUsers.name} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl text-black-600 font-bold">
                    {listUsers.number}+
                  </p>
                  <p className="text-lg text-black-500">{listUsers.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </ScrollAnimationWrapper>
        <div
          className="absolute bg-black-600 opacity-5 w-11/12 rounded-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
          style={{ filter: "blur(114px)" }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;
