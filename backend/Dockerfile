# Use a slim Python 3.11 base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for opencv-python-headless and mediapipe
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt
COPY requirements.txt .

# Install opencv-python-headless first to ensure mediapipe uses it
RUN pip install --no-cache-dir opencv-python-headless==4.10.0.84

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Set environment variables for headless operation
ENV OPENCV_VIDEOIO_MSMF_ENABLE_HW_TRANSFORMS=0
ENV OPENCV_LOG_LEVEL=ERROR

# Command to run the Flask app
CMD ["python", "app.py"]