import { track } from "@vercel/analytics/generic";

const generatorSection = document.getElementById("generator-section");
const loadingSection = document.getElementById("loading-section");
const resultSection = document.getElementById("result-section");
const generateBtn = document.getElementById("generate-btn");
const startNewBtn = document.getElementById("start-new-btn");
const statusMessage = document.getElementById("status-message");
const countdownNum = document.getElementById("countdown-num");
const resultImage = document.getElementById("result-image");

// Image upload elements
const uploadDropzone = document.getElementById("upload-dropzone");
const photoUpload = document.getElementById("photo-upload");
const previewContainer = document.getElementById("preview-container");
const previewImage = document.getElementById("preview-image");
const fileNameDisplay = document.getElementById("file-name");

let selectedFile = null;

// Handle click on dropzone
uploadDropzone.addEventListener("click", () => {
  photoUpload.click();
});

// Handle drag and drop
uploadDropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadDropzone.classList.add("border-primary", "bg-primary-container/10");
});

uploadDropzone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  uploadDropzone.classList.remove("border-primary", "bg-primary-container/10");
});

uploadDropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadDropzone.classList.remove("border-primary", "bg-primary-container/10");
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith("image/")) {
    handleFileSelect(files[0]);
  }
});

// Handle file input change
photoUpload.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0]);
  }
});

function handleFileSelect(file) {
  selectedFile = file;
  fileNameDisplay.textContent = file.name;

  track("photo_uploaded", { file_type: file.type });

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewContainer.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

const loadingStages = [
  { message: "Analyzing preferences...", duration: 2000 },
  { message: "Scanning compatibility metrics...", duration: 2000 },
  { message: "Generating soulmate profile...", duration: 2000 },
  { message: "Creating your perfect match...", duration: 2000 },
  { message: "Finalizing the connection...", duration: 2000 },
];

generateBtn.addEventListener("click", function () {
  if (!selectedFile) {
    alert("Please upload a photo to continue.");
    return;
  }

  track("partner_generated");

  // Hide generator section, show loading
  generatorSection.classList.add("hidden");
  loadingSection.classList.remove("hidden");

  // Start loading stages
  let currentStage = 0;
  let elapsedTime = 0;
  const totalTime = loadingStages.reduce(
    (sum, stage) => sum + stage.duration,
    0,
  );

  const updateStage = () => {
    if (currentStage < loadingStages.length) {
      statusMessage.textContent = loadingStages[currentStage].message;
      currentStage++;
      setTimeout(updateStage, loadingStages[currentStage - 1].duration);
    }
  };

  // Update countdown every 100ms
  const countdownInterval = setInterval(() => {
    elapsedTime += 100;
    const remainingTime = Math.max(
      0,
      Math.ceil((totalTime - elapsedTime) / 1000),
    );
    countdownNum.textContent = remainingTime;

    if (elapsedTime >= totalTime) {
      clearInterval(countdownInterval);
    }
  }, 100);

  // Start the stages
  updateStage();

  // After all stages, show the April Fools image and play audio
  setTimeout(() => {
    loadingSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    track("result_revealed");

    // Display April Fools image instead
    resultImage.src = "april fools.webp";

    // Play April Fools audio after 500ms
    setTimeout(() => {
      const audio = new Audio("april-fools-intro.mp3");
      audio.play();
    }, 500);
  }, totalTime);
});

startNewBtn.addEventListener("click", function () {
  track("new_search_started");

  // Reset and go back to generator
  resultSection.classList.add("hidden");
  generatorSection.classList.remove("hidden");
  selectedFile = null;
  previewContainer.classList.add("hidden");
  previewImage.src = "";
  fileNameDisplay.textContent = "";
  photoUpload.value = "";
});
