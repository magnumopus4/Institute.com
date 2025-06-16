/**
 * Main JavaScript file for Magnum Opus Institute website
 * Features: Smooth scrolling, typing effect, course card animations, file upload, and enhanced star effect with breaking stars
 */

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Typing Effect for Hero Tagline
function initTypingEffect() {
    const typewriter = document.getElementById('typewriter');
    if (!typewriter) return;

    const text = "Magnum Opus Institute – JEE, NEET, CBSE, ICSE, JAC Boards (Classes 9-12)";
    typewriter.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            typewriter.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }

    setTimeout(type, 500);
}

// Course Card Hover Effects
function initCourseCardHover() {
    const courseCards = document.querySelectorAll('#courses > div > div');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Toggle Fee Display
function initFeeToggle() {
    const toggleButtons = document.querySelectorAll('#courses button');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const feeId = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            const fee = document.getElementById(feeId);
            fee.classList.toggle('hidden');
            button.textContent = fee.classList.contains('hidden') ? 'Click to view fee' : 'Hide fee';
        });
    });
}

// Fetch and display uploaded files
function fetchUploadedFiles() {
    fetch('/files/Result')
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
            if (fileList) {
                fileList.innerHTML = '';
                if (files.length === 0) {
                    fileList.innerHTML = '<li class="text-gray-500">No results uploaded yet.</li>';
                } else {
                    files.forEach(file => {
                        const resultText = `${file.studentName} - ${file.examType}: ${file.score}`;
                        fileList.innerHTML += `
                            <li class="mb-4 flex items-center">
                                <img src="/Uploads/${file.filename}" alt="${file.studentName}" class="w-16 h-16 rounded-full mr-4 shadow">
                                <span class="text-gray-700">${resultText}</span>
                            </li>`;
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error fetching files:', error);
        });
}

// Handle File Upload
function initFileUpload() {
    const uploadForm = document.getElementById('uploadForm');
    const message = document.getElementById('message');
    if (!uploadForm || !message) return;

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const studentName = document.getElementById('studentName')?.value.trim();
        const examType = document.getElementById('examType')?.value;
        const score = document.getElementById('score')?.value.trim();
        const file = fileInput?.files[0];

        // Client-side validation
        if (!studentName || !examType || !score) {
            message.innerHTML = '<span class="text-red-600">All fields are required!</span>';
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!file || !allowedTypes.includes(file.type)) {
            message.innerHTML = '<span class="text-red-600">Only JPG and PNG files are allowed!</span>';
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            message.innerHTML = '<span class="text-red-600">File size must be less than 10MB!</span>';
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('studentName', studentName);
        formData.append('examType', examType);
        formData.append('score', score);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                message.innerHTML = '<span class="text-blue-600">Result uploaded successfully!</span>';
                fetchUploadedFiles(); // Refresh list
                uploadForm.reset(); // Clear form
            } else {
                message.innerHTML = `<span class="text-red-600">${result.error}</span>`;
            }
        } catch (error) {
            message.innerHTML = '<span class="text-red-600">Error uploading result!</span>';
        }
    });
}

// Contact popup functions
function showContact() {
    const contact = document.getElementById('contact-number');
    if (contact) contact.classList.remove('hidden');
}

function hideContact() {
    const contact = document.getElementById('contact-number');
    if (contact) contact.classList.add('hidden');
}

// Enhanced Star Effect with Motion, Shooting Stars, and Breaking Stars
function fallingStars(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stationaryStars = [];
    let shootingStars = [];
    let particles = []; // For breaking star effect

    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth || window.innerWidth;
        canvas.height = parent.offsetHeight || 400; // Match mobile min-height
        const starCount = window.innerWidth < 640 ? 10 : 20; // Reduced for mobile
        stationaryStars = [];
        for (let i = 0; i < starCount; i++) {
            stationaryStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                baseOpacity: Math.random() * 0.4 + 0.4,
                opacity: Math.random() * 0.4 + 0.4,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                bright: Math.random() < 0.3
            });
        }
    }

    // Initial resize and listen for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Stationary stars with twinkling
        for (let star of stationaryStars) {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
            ctx.fillStyle = star.bright ? '#fffbe9' : '#ffffff';
            ctx.shadowColor = star.bright ? '#fffbe9' : '#ffffff';
            ctx.shadowBlur = star.bright ? 12 : 6;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Shooting stars
        for (let star of shootingStars) {
            ctx.save();
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#fffbe9';
            ctx.shadowBlur = 20;
            ctx.fill();
            // Tail
            const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.dx * 20, star.y - star.dy * 20);
            gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.dx * 20, star.y - star.dy * 20);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.restore();
        }

        // Particles from breaking stars
        for (let particle of particles) {
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            ctx.fillStyle = '#fffbe9';
            ctx.shadowColor = '#fffbe9';
            ctx.shadowBlur = 10; // Increased for sparkle
            ctx.fill();
            ctx.restore();
        }
    }

    function updateStars() {
        // Update stationary stars (twinkling effect)
        for (let star of stationaryStars) {
            star.twinklePhase += star.twinkleSpeed;
            star.opacity = star.baseOpacity + Math.sin(star.twinklePhase) * 0.2;
            star.opacity = Math.max(0.2, Math.min(1, star.opacity));
        }

        // Update shooting stars
        for (let star of shootingStars) {
            star.x += star.dx * star.speed;
            star.y += star.dy * star.speed;
            star.opacity -= star.fadeRate;
            if (star.opacity < 0.5) star.opacity -= 0.015;
        }
        shootingStars = shootingStars.filter(star =>
            star.opacity > 0 &&
            star.x > -20 &&
            star.x < canvas.width + 20 &&
            star.y < canvas.height + 20
        );

        // Update particles
        for (let particle of particles) {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.opacity -= particle.fadeRate;
            particle.size *= 0.97; // Slightly faster shrink for sparkle
            particle.dy += 0.05; // Add slight gravity for realism
        }
        particles = particles.filter(particle => particle.opacity > 0 && particle.size > 0.1);
    }

    // Shooting stars interval
    setInterval(() => {
        if (canvas.width === 0 || canvas.height === 0) return;
        const leftToRight = Math.random() < 0.5;
        let x, dx;
        if (leftToRight) {
            x = Math.random() * (canvas.width * 0.2);
            dx = 1.5 + Math.random() * 0.8;
        } else {
            x = canvas.width - Math.random() * (canvas.width * 0.2);
            dx = -1.5 - Math.random() * 0.8;
        }
        shootingStars.push({
            x: x,
            y: -10,
            size: Math.random() * 1.5 + 1,
            speed: Math.random() * 1.5 + 2,
            opacity: 0,
            fadeRate: 0.02,
            dx: dx,
            dy: 0.8 + Math.random() * 0.4
        });
        const newStar = shootingStars[shootingStars.length - 1];
        let fadeIn = 0;
        const fadeInterval = setInterval(() => {
            newStar.opacity = Math.min(1, newStar.opacity + 0.1);
            fadeIn += 0.1;
            if (fadeIn >= 1) clearInterval(fadeInterval);
        }, 50);
    }, 2000);

    // Breaking stars interval
    setInterval(() => {
        if (canvas.width === 0 || canvas.height === 0 || stationaryStars.length === 0) return;
        // Randomly select a stationary star to break
        if (Math.random() < 0.3) { // 30% chance to trigger
            const index = Math.floor(Math.random() * stationaryStars.length);
            const breakingStar = stationaryStars[index];
            // Remove the star
            stationaryStars.splice(index, 1);
            // Create particles for sparkle effect
            for (let i = 0; i < 10; i++) { // Increased to 10 for denser sparkle
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.5 + 1.5; // Faster for shooting star effect
                particles.push({
                    x: breakingStar.x,
                    y: breakingStar.y,
                    size: Math.random() * 1.2 + 0.8, // Slightly larger
                    opacity: 1,
                    fadeRate: 0.025, // Slower fade for visibility
                    dx: Math.cos(angle) * speed,
                    dy: Math.sin(angle) * speed
                });
            }
            // Add a new stationary star to maintain count
            stationaryStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                baseOpacity: Math.random() * 0.4 + 0.4,
                opacity: Math.random() * 0.4 + 0.4,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                bright: Math.random() < 0.3
            });
        }
    }, 2500); // Break a star every 2.5 seconds for balance

    function animate() {
        updateStars();
        drawStars();
        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    // Hide lighting overlay
    setTimeout(() => {
        const overlay = document.getElementById('lighting-overlay');
        if (overlay) overlay.style.display = 'none';
    }, 500);

    // Hide custom loader
    setTimeout(() => {
        const loader = document.getElementById('custom-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 2500);

    // Initialize features
    initSmoothScrolling();
    initTypingEffect();
    initCourseCardHover();
    initFeeToggle();
    initFileUpload();
    fetchUploadedFiles();

    // Initialize star effects
    setTimeout(() => {
        fallingStars('stars-canvas-left');
        fallingStars('stars-canvas-center');
        fallingStars('stars-canvas-right');
    }, 100); // Slight delay to ensure DOM is ready
});

// Menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('mobile-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!navMenu.classList.contains('hidden') && !navMenu.contains(e.target) && e.target !== menuToggle) {
                navMenu.classList.add('hidden');
            }
        });
    }
});