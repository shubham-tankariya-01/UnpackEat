document.addEventListener("DOMContentLoaded", function () {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.3
  });

  document.querySelectorAll(".scroll-animate").forEach(el => {
    observer.observe(el);
  });

});


/* CURVED LINE TRACING */
const path = document.getElementById("timelinePath");
const pathLength = path.getTotalLength();

path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength;

// Get the first step to offset the line
const firstStep = document.querySelector(".hero-step");
let offsetStart = 0;

function updateOffsetStart() {
  const section = document.querySelector(".steps-section");
  const sectionRect = section.getBoundingClientRect();
  const stepRect = firstStep.getBoundingClientRect();

  // Offset relative to section
  offsetStart = stepRect.bottom - sectionRect.top;
}

updateOffsetStart();
window.addEventListener("resize", updateOffsetStart);

window.addEventListener("scroll", () => {
  const section = document.querySelector(".steps-section");
  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate visible fraction
  const visible = Math.min(
    Math.max((windowHeight - rect.top) / (rect.height + windowHeight), 0),
    1
  );

  const speedMultiplier = 1.4;
  let progress = visible * speedMultiplier;
  if (progress > 1) progress = 1;

  // Calculate stroke offset starting after first step
  const startOffset = pathLength * (offsetStart / rect.height);
  path.style.strokeDashoffset = pathLength * (1 - progress) + startOffset;
});

/* STEP REVEAL ANIMATION */
const steps = document.querySelectorAll(".hero-step");

function revealSteps() {
  steps.forEach(step => {
    const rect = step.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      step.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealSteps);
revealSteps();

// Search tab

document.addEventListener("DOMContentLoaded", function() {
    // 1. Get our HTML elements
    const startCameraBtn = document.getElementById("start-camera-btn");
    const scanBtnText = document.getElementById("scan-btn-text");
    const fileInput = document.getElementById("barcode-upload");
    const resultInput = document.getElementById("barcode-result");
    const readerDiv = document.getElementById("reader");

    // 2. Initialize the scanner library
    const html5QrCode = new Html5Qrcode("reader");
    let isCameraOpen = false;

    // --- FUNCTION 1: HANDLE CAMERA SCANNING ---
    startCameraBtn.addEventListener("click", () => {
        if (isCameraOpen) {
            // If camera is on, turn it off
            html5QrCode.stop().then(() => {
                readerDiv.style.display = "none";
                scanBtnText.innerText = "Scan Barcode";
                isCameraOpen = false;
            }).catch((err) => {
                console.error("Failed to stop camera.", err);
            });
        } else {
            // If camera is off, turn it on
            readerDiv.style.display = "block";
            scanBtnText.innerText = "Stop Camera";
            isCameraOpen = true;

            // Start scanning using the back camera (environment)
            html5QrCode.start(
                { facingMode: "environment" }, 
                {
                    fps: 10,    // Scans 10 times per second
                    qrbox: { width: 250, height: 150 } // Creates a scanning box
                },
                (decodedText, decodedResult) => {
                    // SUCCESS! Barcode found.
                    console.log(`Scan result: ${decodedText}`);
                    resultInput.value = decodedText; // Put number in the search bar
                    
                    // Optional: Automatically stop the camera after a successful scan
                    html5QrCode.stop().then(() => {
                        readerDiv.style.display = "none";
                        scanBtnText.innerText = "Scan Barcode";
                        isCameraOpen = false;
                    });
                },
                (errorMessage) => {
                    // It constantly throws errors when a barcode ISN'T in frame. 
                    // We just ignore these so it doesn't spam the console.
                }
            ).catch((err) => {
                console.error("Camera start failed.", err);
                alert("Could not start camera. Please ensure you have granted camera permissions.");
                readerDiv.style.display = "none";
                scanBtnText.innerText = "Scan Barcode";
                isCameraOpen = false;
            });
        }
    });

    // --- FUNCTION 2: HANDLE FILE UPLOAD SCANNING ---
    fileInput.addEventListener("change", (event) => {
        if (event.target.files.length == 0) {
            return; // User canceled the upload
        }
        
        const imageFile = event.target.files[0];
        
        // Scan the uploaded image file
        html5QrCode.scanFile(imageFile, true)
            .then(decodedText => {
                // SUCCESS! Barcode found in image.
                console.log(`File scan result: ${decodedText}`);
                resultInput.value = decodedText; // Put number in the search bar
            })
            .catch(err => {
                // FAILED to find barcode in image.
                console.error(`Error scanning file.`, err);
                alert("Could not find a clear barcode in that image. Try a different photo.");
            });
    });
});

// Score Animation
function animateScore(circleId, textId, percent) {
    const circle = document.getElementById(circleId);
    const text = document.getElementById(textId);

    if (!circle || !text) return; // STOP if not on this page

    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    let current = 0;

    const interval = setInterval(() => {
        if (current >= percent) clearInterval(interval);
        circle.style.strokeDashoffset =
            circumference - (current / 100) * circumference;
        text.innerHTML = current + "%";
        current++;
    }, 20);
}


animateScore("score1", "scoreText1", 78);
animateScore("score2", "scoreText2", 64);

// Scanner Mock
function openCamera() {
  alert("Camera access granted (Mock Scanner)");
}

// Tag System
function addTag() {
  const input = document.getElementById("tagInput");
  if (input.value.trim() === "") return;
  createChip(input.value);
  input.value = "";
}

function addPreset(tag) {
  createChip(tag);
}

function createChip(text) {
  const container = document.getElementById("tagsContainer");
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.innerHTML = `${text} <button onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(chip);
}

document.addEventListener("DOMContentLoaded", function () {

    fetch("navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Navbar failed to load");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
            setActiveNav();
        })
        .catch(error => console.error("Error loading navbar:", error));

});


function setActiveNav() {
    const links = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active", "fw-bold");
        }
    });
}


//contribution DATA
document.getElementById("contributionForm").addEventListener("submit", function(e){
    e.preventDefault();

    // Collect Data
    const product = {
        name: document.getElementById("productName").value,
        brand: document.getElementById("brandName").value,
        ingredients: document.getElementById("ingredients").value
    };

    // Store temporarily in localStorage (easy backend-ready pattern)
    localStorage.setItem("newContribution", JSON.stringify(product));

    alert("Contribution submitted successfully!");

    // Redirect back to Home
    window.location.href = "index.html";
}); 

// HIstory
document.addEventListener("DOMContentLoaded", function () {
    const historyContainer = document.getElementById("historyContainer");
    const historyData = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (historyData.length === 0) {
        historyContainer.innerHTML = "<p>No history available.</p>";
        return;
    }

    historyData.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        col.innerHTML = `
            <div class="card p-3 shadow-sm">
                <h5>${item.name}</h5>
                <p>${item.brand}</p>
            </div>
        `;
        historyContainer.appendChild(col);
    });
});

// Wait for the DOM content to fully load before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // Select elements using IDs for better specificity
    const titleHeading = document.getElementById('title');
    const nameField = document.getElementById('nameInput');
    const signUpBtn = document.getElementById('signUpBtn');
    const signInBtn = document.getElementById('signInBtn');

    // Action when "Sign In" button is clicked
    signInBtn.addEventListener('click', () => {
        titleHeading.innerHTML = "Sign In";
        // Hide the name field
        nameField.classList.add('hide-field');
        // Update button styles
        signUpBtn.classList.add('disable');
        signInBtn.classList.remove('disable');
    });


    // Action when "Sign Up" button is clicked
    signUpBtn.addEventListener('click', () => {
        titleHeading.innerHTML = "Sign Up";
        // Show the name field
        nameField.classList.remove('hide-field');
        // Update button styles
        signUpBtn.classList.remove('disable');
        signInBtn.classList.add('disable');
    });

});