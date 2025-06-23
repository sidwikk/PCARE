const video = document.getElementById("video");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Webcam error:", err);
  });

function detect() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("image", blob);

    fetch("https://detect.roboflow.com/superworms-1r3ob/1?api_key=n2X7gQwFwVV9sftqam36", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log("Predictions:", data);
    })
    .catch(err => console.error("Detection error:", err));
  }, "image/jpeg");
}

// Run detection every 2 seconds
setInterval(detect, 2000);
