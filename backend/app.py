from flask import Flask, request, jsonify
import mediapipe as mp
import numpy as np
import base64
from flask_cors import CORS
import os
os.environ["OPENCV_VIDEOIO_MSMF_ENABLE_HW_TRANSFORMS"] = "0"
os.environ["OPENCV_LOG_LEVEL"] = "ERROR"
from dotenv import load_dotenv
import cv2

load_dotenv()

allowed_origins = os.getenv('ALLOWED_ORIGINS', '').split(',')
print(f"Allowed origins: {allowed_origins}")  

app = Flask(__name__)
CORS(app, resources={
    r"/analyze": {
        "origins": allowed_origins if allowed_origins != [''] else ["https://posture-detection-mauve.vercel.app"],
        "methods": ["POST", "OPTIONS"],  
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    min_detection_confidence=0.6,  
    min_tracking_confidence=0.6  
)

def calculate_angle(a, b, c):
    """Calculate angle between three points in degrees"""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    return min(angle, 360-angle)  

def analyze_posture(image_data):
    """Process image and return posture analysis for sitting posture"""
    try:
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": "Invalid image data"}
            
        img_height, img_width = img.shape[:2]

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = pose.process(img_rgb)
        
        if not results.pose_landmarks:
            return {"error": "No person detected"}
        
        # Extract key landmarks
        landmarks = results.pose_landmarks.landmark
        required_joints = [
            mp_pose.PoseLandmark.LEFT_EAR,
            mp_pose.PoseLandmark.LEFT_SHOULDER,
            mp_pose.PoseLandmark.LEFT_HIP
        ]

        for j in required_joints:
            visibility = landmarks[j.value].visibility
            print(f"Landmark {j.name}: visibility = {visibility}")  # Debug logging
        if any(landmarks[j.value].visibility < 0.3 for j in required_joints):
            return {"error": "Key body parts not visible. Ensure your head, shoulders, and hips are in the frame."}

        joints = {
            'ear': [int(landmarks[mp_pose.PoseLandmark.LEFT_EAR.value].x * img_width),
                   int(landmarks[mp_pose.PoseLandmark.LEFT_EAR.value].y * img_height)],
            'shoulder': [int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x * img_width),
                        int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y * img_height)],
            'hip': [int(landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x * img_width),
                   int(landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y * img_height)]
        }
        
        # Calculate neck angle
        neck_angle = calculate_angle(joints['ear'], joints['shoulder'], joints['hip'])

        feedback = []
        if neck_angle < 150:
            feedback.append(f"Forward head posture detected (neck angle: {neck_angle:.1f}°)")

        annotated_img = img.copy()
        
        # Draw skeleton
        mp.solutions.drawing_utils.draw_landmarks(
            annotated_img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        center = joints['shoulder']
        cv2.line(annotated_img, joints['ear'], center, (255, 255, 0), 2)  # Cyan for neck
        cv2.line(annotated_img, center, joints['hip'], (255, 255, 0), 2)
        
        # Draw angle text
        text_pos = (center[0] + 20, center[1] + 20)
        angle_color = (0, 0, 255) if neck_angle > 30 else (0, 255, 0)
        cv2.putText(annotated_img, f"{neck_angle:.1f}°", 
                    text_pos, cv2.FONT_HERSHEY_SIMPLEX, 
                    0.7, angle_color, 2)

        _, buffer = cv2.imencode('.jpg', annotated_img)
        
        # Calculate posture score based on neck angle
        neck_deviation = max(0, neck_angle - 30)
        posture_score = min(100, max(0, int(100 - neck_deviation * 2)))  
        
        return {
            "annotated_image": base64.b64encode(buffer).decode('utf-8'),
            "angles": {
                "neck": neck_angle
            },
            "feedback": feedback if feedback else ["Good posture!"],
            "posture_score": posture_score
        }
        
    except Exception as e:
        print(f"Posture analysis error: {str(e)}")
        return {"error": "Posture analysis failed"}

@app.route('/analyze', methods=['POST'])
def analyze():
    """posture analysis"""
    if not request.json or 'image' not in request.json:
        return jsonify({"error": "No image provided"}), 400
        
    try:
        image_data = request.json['image'].split(',')[1]  
        result = analyze_posture(image_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)