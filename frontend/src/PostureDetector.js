import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion } from "framer-motion";


const backendUrl = process.env.REACT_APP_BASE_URL;

function PostureDetector() {
  const webcamRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  console.log(process.env.REACT_APP_BASE_URL);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const captureAndAnalyze = async () => {
    if (!webcamRef.current) {
      setFeedback(["No image captured from webcam."]);
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setFeedback(["No image captured from webcam."]);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/analyze`, {
        image: imageSrc,
      });

      // Ensuring feedback is an array
      const feedbackData = Array.isArray(response.data.feedback)
        ? response.data.feedback
        : response.data.error
        ? [response.data.error]
        : ["Unexpected response format from server."];

      setAnnotatedImage(
        response.data.annotated_image
          ? `data:image/jpeg;base64,${response.data.annotated_image}`
          : null
      );
      setFeedback(feedbackData);
    } catch (error) {
      console.error(
        "Error analyzing posture:",
        error.message,
        error.response?.data
      );
      const errorMessage = error.response?.data?.error
        ? error.response.data.error
        : "Failed to connect to the backend. Please ensure it is running at http://localhost:5000.";
      setFeedback([errorMessage]);
    }
  };

  const toggleDetection = () => {
    if (isDetecting) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    } else {
      const id = setInterval(captureAndAnalyze, 3000);
      setIntervalId(id);
      captureAndAnalyze();
    }
    setIsDetecting(!isDetecting);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 mesh-background text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
            Posture Detection
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
              Live Webcam
            </h2>
            <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
              {isDetecting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-full text-base"
                >
                  Analyzing...
                </motion.div>
              )}
            </div>
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
          </div>

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
        </motion.div>

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
      </div>
    </div>
  );
}

export default PostureDetector;
