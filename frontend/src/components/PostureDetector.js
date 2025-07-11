import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion } from "framer-motion";
import DetectionControls from "./DetectionControls";
import AnalysisResults from "./AnalysisResults";
import HowItWorks from "./HowItWorks";
import ThemeToggle from "./ThemeToggle";
import WebcamFeed from "./WebcamFeed";

const backendUrl = process.env.REACT_APP_BASE_URL;

function PostureDetector() {
  const webcamRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
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
      console.error("Error analyzing posture:", error.message, error.response?.data);
      const errorMessage = error.response?.data?.error
        ? error.response.data.error
        : "Failed to connect to the backend. Please ensure it is running.";
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
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
          <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
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
            <WebcamFeed 
              webcamRef={webcamRef} 
              isDetecting={isDetecting} 
            />
            <DetectionControls 
              isDetecting={isDetecting} 
              toggleDetection={toggleDetection} 
            />
          </div>

          <AnalysisResults 
            annotatedImage={annotatedImage} 
            feedback={feedback} 
          />
        </motion.div>

        <HowItWorks />
      </div>
    </div>
  );
}

export default PostureDetector;