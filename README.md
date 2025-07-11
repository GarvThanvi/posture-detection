Posture Detection System
Overview
This project is a real-time posture detection system that analyzes sitting posture using a webcam. It leverages computer vision with MediaPipe to detect body landmarks and calculate neck angles, providing feedback on posture quality. The system consists of a Flask backend for processing images and a React frontend for user interaction.
Features

Real-time Posture Analysis: Captures webcam images every 3 seconds to analyze sitting posture.
Neck Angle Detection: Calculates the neck angle to identify forward head posture (angles < 150°).
Visual Feedback: Displays an annotated image with posture landmarks and angle measurements.
Responsive UI: Built with React, Tailwind CSS, and Framer Motion for smooth animations and dark mode support.

Tech Stack

Backend: Flask, OpenCV, MediaPipe
Frontend: React, Tailwind CSS, Framer Motion, Axios, react-webcam
Languages: Python, JavaScript
Environment: Node.js, Python 3.8+

Prerequisites

Python 3.8 or higher
Node.js 18 or higher
Webcam for live capture
Git 

Installation and Setup
1. Clone the Repository
git clone <repository-url>
cd posture-detection-system

2. Backend Setup

Navigate to the backend directory (where the Flask app is located):cd backend


Create a virtual environment and activate it:python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install the required Python packages:pip install flask flask-cors opencv-python mediapipe numpy


Run the Flask server:python app.py

The backend will run on http://localhost:5000.

3. Frontend Setup

Navigate to the frontend directory:cd frontend


Install Node.js dependencies:npm install


Create a .env file in the frontend directory and add the backend URL:echo "REACT_APP_BASE_URL=http://localhost:5000" > .env


Start the React development server:npm start

The frontend will run on http://localhost:3000.

4. Running the Application

Ensure the backend server is running (http://localhost:5000).
Open the frontend in a browser (http://localhost:3000).
Allow webcam access when prompted.
Click "Start Detection" to begin posture analysis. The system will capture and analyze images every 3 seconds, displaying results and feedback.

Usage

Start/Stop Detection: Click the "Start Detection" button to begin analyzing posture. Click "Stop Detection" to pause.
Feedback: View posture feedback and an annotated image with landmarks and neck angle on the right panel.
Dark Mode: Toggle between light and dark modes using the sun/moon icon in the top-right corner.
Posture Tips: Ensure your head, shoulders, and hips are visible in the webcam frame for accurate detection.


Troubleshooting

Webcam Issues: Ensure your webcam is connected and permissions are granted in the browser.
Backend Connection Error: Verify the Flask server is running and the REACT_APP_BASE_URL in .env matches the backend URL (http://localhost:5000).
Dependencies: Ensure all Python and Node.js packages are installed correctly.
Visibility Errors: If you see "Key body parts not visible," adjust your position to keep head, shoulders, and hips in the webcam frame.

Limitations

Requires a clear view of head, shoulders, and hips for accurate analysis.
