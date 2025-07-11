import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        How It Works
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-base">
        <li>
          Click "Start Detection" to begin analyzing your sitting posture
        </li>
        <li>The system will check your posture every 3 seconds</li>
        <li>
          For sitting posture, it detects:
          <ul className="list-disc pl-5 mt-2">
            <li>Forward head posture (neck angle less than 150Degrees)</li>
          </ul>
        </li>
        <li>Results show with marked neck angle and feedback</li>
      </ul>
    </motion.div>
  );
};

export default HowItWorks;