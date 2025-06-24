const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const status = document.getElementById("status");

// Roboflow Model Info
const ROBOFLOW_API_KEY = "n2X7gQwFwVV9sftqam36";
const ROBOFLOW_PROJECT = "uod-detection";
const ROBOFLOW_VERSION = 1;
const API_URL = `https://detect.roboflow.com/${ROBOFLOW_PROJECT}/${ROBOFLOW_VERSION}?api_key=${ROBOFLOW_API_KEY}`;

// Use back camera if available
const constraints = {
  video: {
    facingMode: { exact: "environment" } // Use back camera on phones
  }
};

// Start webcam stream
navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      setInterval(detect, 2000);
    };
  })
  .catch((err) => {
    console.error("Webcam error:", err);
    status.innerText = "❌ Webcam access error (try switching camera)";
  });

function detect() {
  if (video.videoWidth === 0 || video.videoHeight === 0) return;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("image", blob);

    fetch(API_URL, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log("Predictions:", data);
        if (data?.predictions?.length > 0) {
          status.innerText = "🪱 Worm detected!";
          drawBoxes(data.predictions);
        } else {
          status.innerText = "✅ No pests detected.";
          context.drawImage(video, 0, 0);
        }
      })
      .catch(err => {
        console.error("Detection error:", err);
        status.innerText = "⚠️ Detection failed.";
      });
  }, "image/jpeg");
}

function drawBoxes(predictions) {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.lineWidth = 2;
  context.strokeStyle = "red";
  context.fillStyle = "red";
  context.font = "18px Arial";

  predictions.forEach(pred => {
    const x = pred.x - pred.width / 2;
    const y = pred.y - pred.height / 2;
    context.strokeRect(x, y, pred.width, pred.height);
    context.fillText(`${pred.class} ${Math.round(pred.confidence * 100)}%`, x, y - 5);
  });
}

