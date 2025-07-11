Posture Detection System
Overview
This project is a real-time posture detection system that analyzes sitting posture using a webcam. It leverages computer vision with MediaPipe to detect body landmarks and calculate neck angles, providing feedback on posture quality. The system consists of a Flask backend for processing images and a React frontend for user interaction.

Features
Real-time Posture Analysis: Captures webcam images every 3 seconds to analyze sitting posture.

Neck Angle Detection: Calculates the neck angle to identify forward head posture (angles < 150°).

Visual Feedback: Displays an annotated image with posture landmarks and angle measurements.

Responsive UI: Built with React, Tailwind CSS, and Framer Motion for smooth animations and dark mode support.

🛠 Tech Stack Used
Backend: Flask, OpenCV, MediaPipe

Frontend: React, Tailwind CSS, Framer Motion, Axios, react-webcam

Languages: Python, JavaScript

Environment: Python 3.8+

⚙️ Setup Instructions (Local Development)
1. Clone the Repository
git clone <repository-url>
cd posture-detection
2. Backend Setup
Navigate to the backend directory:

cd backend
Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
Install required dependencies:

pip install flask flask-cors opencv-python mediapipe numpy
Run the Flask server:

python app.py
The backend will now be running at: http://localhost:5000

3. Frontend Setup
Navigate to the frontend directory:

cd frontend
Install Node.js dependencies:

npm install
Create a .env file and add the backend URL:

echo "REACT_APP_BASE_URL=http://localhost:5000" > .env
Start the React development server:

npm start
The frontend will now be running at: http://localhost:3000

4. Running the Application
Ensure the backend server is running on http://localhost:5000.

Open the frontend in your browser: http://localhost:3000.

Allow webcam access when prompted.

Click "Start Detection" to begin posture analysis.

🚀 Deployed App
https://posture-detection-mauve.vercel.app

🎥 Demo Video
https://drive.google.com/file/d/1uwyDtx-xmOTFXIKPTMgXtv83HVegetAu/view?usp=sharing
