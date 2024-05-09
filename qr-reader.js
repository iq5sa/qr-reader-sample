const video = document.getElementById('qr-video');
const canvasElement = document.getElementById('qr-canvas');
const canvas = canvasElement.getContext('2d');

// Use navigator.mediaDevices.getUserMedia to access the user's camera
navigator.mediaDevices.getUserMedia({ video: {
    facingMode: "user"},
  })
    .then(handleVideoStream)
    .catch(handleError);

function handleVideoStream(stream) {
    video.srcObject = stream;
    video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen

    video.play();
    requestAnimationFrame(tick);
}

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            video.pause();
            video.srcObject.getTracks().forEach(track => track.stop());
            canvasElement.style.display = 'none';
            document.getElementById('qr-video').style.display = 'none';
            document.getElementById('qr-canvas').style.display = 'block';
            document.getElementById('qr-result').innerHTML = code.data;
            console.log("Found QR code:", code.data);

            // Send the decoded QR code to the server
            
        }
    }
    requestAnimationFrame(tick);
}

function handleError(error) {
    console.error('Error accessing media devices.', error);
}
