/**
 * Main JavaScript file for Magnum Opus Institute website
 * Features: Smooth scrolling, typing effect, course card animations, and file upload
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
    const tagline = document.querySelector('#home p');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            tagline.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }

    setTimeout(type, 500);
}

// Course Card Hover Effects
function initCourseCardHover() {
    const courseCards = document.querySelectorAll('#courses .bg-white');
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
    const toggleButtons = document.querySelectorAll('.toggle-fee');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const fee = button.nextElementSibling;
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
            fileList.innerHTML = '';
            if (files.length === 0) {
                fileList.innerHTML = '<li class="text-gray-500">No results uploaded yet.</li>';
            } else {
                files.forEach(file => {
                    const resultText = `${file.studentName} - ${file.examType}: ${file.score}`;
                    fileList.innerHTML += `
                        <li class="mb-4 flex items-center">
                            <img src="/uploads/${file.filename}" alt="${file.studentName}" class="w-16 h-16 rounded-full mr-4 shadow">
                            <span class="text-gray-700">${resultText}</span>
                        </li>`;
                });
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
    if (!uploadForm) return;

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const studentName = document.getElementById('studentName').value.trim();
        const examType = document.getElementById('examType').value;
        const score = document.getElementById('score').value.trim();
        const file = fileInput.files[0];

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

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initTypingEffect();
    initCourseCardHover();
    initFeeToggle();
    initFileUpload();
    fetchUploadedFiles();
});