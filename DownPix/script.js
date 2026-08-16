// DOM Elements
const imageUrlInput = document.getElementById('imageUrl');
const saveFolderInput = document.getElementById('saveFolder');
const downloadBtn = document.getElementById('downloadBtn');
const statusMessage = document.getElementById('statusMessage');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Event Listeners
downloadBtn.addEventListener('click', handleDownload);
imageUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleDownload();
});

// Main Download Handler
function handleDownload() {
    const imageUrl = imageUrlInput.value.trim();
    const saveFolder = saveFolderInput.value.trim() || 'downloads';

    // Validation
    if (!imageUrl) {
        showMessage('Please enter a valid image URL', 'error');
        return;
    }

    if (!isValidUrl(imageUrl)) {
        showMessage('Please enter a valid URL', 'error');
        return;
    }

    // Disable button and show loading state
    downloadBtn.disabled = true;
    downloadBtn.classList.add('loading');
    hideMessage();
    showProgress();

    try {
        // Simulate download progress for smooth UX
        simulateProgress();

        // Create a hidden anchor element
        const link = document.createElement('a');
        link.href = `/download_image?url=${encodeURIComponent(imageUrl)}&save_folder=${encodeURIComponent(saveFolder)}`;
        link.style.display = 'none';
        link.setAttribute('download', '');

        // Append to body, trigger click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Complete the progress animation
        completeProgress();
        showMessage('✓ Download started! Check your Downloads folder.', 'success');
        clearInputs();

    } catch (error) {
        console.error('Error:', error);
        resetProgress();
        showMessage('An error occurred. Please try again.', 'error');
    } finally {
        // Re-enable button
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('loading');
    }
}

// URL Validation
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Progress Simulation
let progressInterval;
function simulateProgress() {
    let progress = 0;
    progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 30;
            updateProgress(Math.min(progress, 90));
        }
    }, 300);
}

// Update Progress Bar
function updateProgress(percent) {
    const rounded = Math.round(percent);
    progressFill.style.width = rounded + '%';
    progressText.textContent = rounded + '%';
}

// Complete Progress
function completeProgress() {
    clearInterval(progressInterval);
    updateProgress(100);
    setTimeout(() => {
        resetProgress();
    }, 600);
}

// Reset Progress
function resetProgress() {
    clearInterval(progressInterval);
    hideProgress();
    updateProgress(0);
}

// Show Progress Container
function showProgress() {
    progressContainer.classList.remove('hidden');
    updateProgress(0);
}

// Hide Progress Container
function hideProgress() {
    progressContainer.classList.add('hidden');
}

// Show Status Message
function showMessage(text, type = 'info') {
    statusMessage.textContent = text;
    statusMessage.className = `status-message show ${type}`;
    
    // Auto-hide after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

// Hide Status Message
function hideMessage() {
    statusMessage.classList.remove('show');
}

// Clear Inputs
function clearInputs() {
    setTimeout(() => {
        imageUrlInput.value = '';
        imageUrlInput.focus();
    }, 500);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    imageUrlInput.focus();

    // Add smooth transitions on input focus
    imageUrlInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
    });

    imageUrlInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});
