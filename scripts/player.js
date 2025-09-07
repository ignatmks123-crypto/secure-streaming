document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Get video ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'));
    
    if (!videoId) {
        alert('No video specified');
        window.location.href = 'videos.html';
        return;
    }
    
    // Load video data
    const videos = JSON.parse(localStorage.getItem('videos')) || [];
    const video = videos.find(v => v.id === videoId);
    
    if (!video) {
        alert('Video not found');
        window.location.href = 'videos.html';
        return;
    }
    
    // Check if user has access to this video
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    if (!video.isPublic && userRole !== 'admin' && video.uploadedBy !== username) {
        alert('You do not have permission to view this video');
        window.location.href = 'videos.html';
        return;
    }
    
    // Display video info
    document.getElementById('videoTitle').textContent = video.title;
    if (video.description) {
        document.getElementById('videoDescription').textContent = video.description;
    }
    
    // Set up the video player
    const videoElement = document.getElementById('secureVideo');
    
    // For demo purposes, we'll use the stored URL
    // In a real application, you would use a secure streaming method
    if (video.fileUrl) {
        videoElement.src = video.fileUrl;
    } else {
        videoElement.innerHTML = `
            <p>Video source not available. This is a demo.</p>
            <p>In a real application, the video would be streamed securely.</p>
        `;
    }
    
    // Add event listener for when video ends
    videoElement.addEventListener('ended', function() {
        console.log('Video playback completed');
    });
});