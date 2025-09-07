document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    const publicVideosList = document.getElementById('publicVideosList');
    
    // Load public videos
    loadPublicVideos();
    
    function loadPublicVideos() {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        publicVideosList.innerHTML = '';
        
        // Filter public videos
        const publicVideos = videos.filter(video => video.isPublic);
        
        if (publicVideos.length === 0) {
            publicVideosList.innerHTML = '<p>No public videos available yet.</p>';
            return;
        }
        
        publicVideos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            
            videoCard.innerHTML = `
                <div class="video-thumbnail">Video Preview</div>
                <div class="video-info-card">
                    <h4>${video.title}</h4>
                    <p>${video.description || 'No description'}</p>
                    <p><small>Uploaded by: ${video.uploadedBy}</small></p>
                    <p><small>Uploaded: ${new Date(video.uploadDate).toLocaleDateString()}</small></p>
                    <div class="video-actions">
                        <a href="watch.html?id=${video.id}">Watch</a>
                    </div>
                </div>
            `;
            
            publicVideosList.appendChild(videoCard);
        });
    }
});