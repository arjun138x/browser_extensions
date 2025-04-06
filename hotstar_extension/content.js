let isCropped = false;
let cropButton = null;

function applyCrop(video) {
  const parent = video.parentElement;
  video.removeAttribute("style");
  if (parent) parent.removeAttribute("style");

  // Apply styles to simulate cropping:
  // 1. Make video full screen
  // 2. Use object-fit cover to zoom in and crop
  // 3. Use transform to scale (16:10 crop simulation) === scale(1.22).
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.objectFit = "cover";
  video.style.transform = "scale(1.05)"; // adjust this for zoom level
  video.style.transition = "transform 0.3s ease";
  video.style.position = "absolute";
  video.style.top = "0";
  video.style.left = "0";
  video.style.zIndex = "1";

  isCropped = true;
}

function resetCrop(video) {
  const parent = video.parentElement;
  video.removeAttribute("style");
  if (parent) parent.removeAttribute("style");

  isCropped = false;
}

function toggleCrop() {
  const video = document.querySelector("video");
  if (!video) return;

  isCropped ? resetCrop(video) : applyCrop(video);
  updateButtonLabel();
}

function updateButtonLabel() {
  if (cropButton) {
    cropButton.textContent = isCropped ? "Uncrop" : "Crop";
  }
}

function createCropButton(container) {
  cropButton = document.createElement("button");
  cropButton.textContent = "Crop";
  cropButton.style.position = "absolute";
  cropButton.style.bottom = "10px";
  cropButton.style.right = "150px";
  cropButton.style.zIndex = "999999";
  cropButton.style.padding = "8px 14px";
  cropButton.style.fontSize = "14px";
  cropButton.style.background = "#ff5722";
  //   cropButton.style.background = "rgba(43, 219, 58, 0.3)";
  cropButton.style.color = "white";
  cropButton.style.border = "none";
  cropButton.style.borderRadius = "8px";
  cropButton.style.cursor = "pointer";
  cropButton.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
  cropButton.style.opacity = "0.85";

  cropButton.addEventListener("click", toggleCrop);
  container.appendChild(cropButton);
}

// Monitor full-screen changes
document.addEventListener("fullscreenchange", () => {
  const fullscreenEl = document.fullscreenElement;
  const video = document.querySelector("video");

  if (fullscreenEl && fullscreenEl.contains(video)) {
    // In full-screen and video is full-screen target
    if (!cropButton) createCropButton(fullscreenEl);
    cropButton.style.display = "block";
  } else {
    // Exit full-screen
    if (cropButton) cropButton.style.display = "none";
    resetCrop(video);
    updateButtonLabel();
  }
});

// Start watching for video on page
function waitForVideo() {
  const video = document.querySelector("video");
  if (video) {
    console.log("🎥 Video detected, ready for full-screen crop.");
  } else {
    setTimeout(waitForVideo, 1000);
  }
}

waitForVideo();
