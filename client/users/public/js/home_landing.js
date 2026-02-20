// SRCOLL ANIMATION
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

/* NAVBAR HIDE-ON-SCROLL */
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");
const scrollThreshold = 10; // Pixels to scroll before hiding/showing

window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const mobileMenu = document.getElementById("mobileMenu");

    // Don't hide navbar if mobile menu is open
    if (mobileMenu && mobileMenu.classList.contains("show")) {
        return;
    }

    if (Math.abs(lastScrollTop - scrollTop) <= scrollThreshold) {
        return;
    }

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll Down - Hide Navbar
        navbar.classList.add("navbar-hidden");
    } else {
        // Scroll Up - Show Navbar
        navbar.classList.remove("navbar-hidden");
    }

    lastScrollTop = scrollTop;
});
