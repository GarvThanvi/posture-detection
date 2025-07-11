import React from 'react';
import { motion } from 'framer-motion';

const DetectionControls = ({ isDetecting, toggleDetection }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDetection}
      className={`mt-6 w-full py-4 px-6 rounded-xl font-medium text-lg text-white ${
        isDetecting
          ? "bg-red-500 hover:bg-red-600"
          : "bg-indigo-600 hover:bg-indigo-700"
      } transition-colors duration-200`}
    >
      {isDetecting ? "Stop Detection" : "Start Detection"}
    </motion.button>
  );
};

export default DetectionControls;