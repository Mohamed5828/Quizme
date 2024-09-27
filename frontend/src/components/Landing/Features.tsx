

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import getScrollAnimation from '../../utils/ScrollAnimation';
import ScrollAnimationWrapper from "./AnimationWrapper";
import test from '../../images/Online test-rafiki.png';
import customIcon from '../../images/icons8-check-48.png';  


const features: string[] = [
  "Create an Exam with ease",
  "Built In code Editor",
  "Camera Monitoring",
  "Browser Monitoring",
];

const Feature: React.FC = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div
      className="max-w-screen-xl mt-8 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="feature"
    >
      <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 py-8 my-12">
        <ScrollAnimationWrapper className="flex w-full justify-end">
          <motion.div className="h-full w-full p-4" variants={scrollAnimation}>
            <img
              src={test}
              alt="VPN Illustration"
              width={500}
              height={300}
            />
          </motion.div>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <motion.div
            className="flex flex-col items-end justify-center ml-auto w-full lg:w-9/12"
            variants={scrollAnimation}
          >
            <h3 className="text-3xl lg:text-4xl font-medium leading-relaxed text-black-600">
              We Provide Many Features You Can Use
            </h3>
            <p className="my-2 text-black-500">
            You can explore our features in an engaging way, with each offering its own unique functionality.
            </p>
            <ul className="text-black-500 self-start list-inside ml-8">
              {features.map((feature, index) => (
                <motion.li
                  className="relative flex items-center space-x-2"
                  custom={{ duration: 2 + index }}
                  variants={scrollAnimation}
                  key={feature}
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >
               
                  <img
                    src={customIcon}    
                    alt="Check Icon"
                    className="h-5 w-5"  
                  />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
};

export default Feature;
