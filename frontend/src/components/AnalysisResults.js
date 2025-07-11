import React from 'react';
import { motion } from 'framer-motion';

const AnalysisResults = ({ annotatedImage, feedback }) => {
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Analysis Results
      </h2>
      <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-6">
        {annotatedImage ? (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={annotatedImage}
            alt="Posture analysis"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-lg">
            Analysis will appear here
          </div>
        )}
      </div>
      <div className="space-y-3">
        {Array.isArray(feedback) && feedback.length > 0 ? (
          feedback.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl text-base ${
                message.includes("Good")
                  ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
              }`}
            >
              {message}
            </motion.div>
          ))
        ) : (
          <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-base">
            No feedback available
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;