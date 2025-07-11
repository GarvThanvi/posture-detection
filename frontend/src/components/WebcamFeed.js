import React from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

const WebcamFeed = ({ webcamRef, isDetecting }) => {
  return (
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
  );
};

export default WebcamFeed;