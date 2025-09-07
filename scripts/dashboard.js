document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true' || 
        localStorage.getItem('userRole') !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    const uploadForm = document.getElementById('uploadForm');
    const videosList = document.getElementById('videosList');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.querySelector('.progress');
    const progressText = document.getElementById('progressText');
    
    // Load existing videos
    loadVideos();
    
    // Handle video upload
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('videoTitle').value;
            const description = document.getElementById('videoDescription').value;
            const isPublic = document.getElementById('videoPublic').checked;
            const fileInput = document.getElementById('videoFile');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a video file');
                return;
            }
            
            // Check if file is a video
            if (!file.type.startsWith('video/')) {
                alert('Please select a valid video file');
                return;
            }
            
            // Show progress bar
            uploadProgress.style.display = 'flex';
            
            // Simulate upload process
            simulateUpload(file, title, description, isPublic);
        });
    }
    
    function simulateUpload(file, title, description, isPublic) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress >= 100) {
                clearInterval(interval);
                
                // Create a video object
                const video = {
                    id: Date.now(),
                    title: title,
                    description: description,
                    filename: file.name,
                    uploadDate: new Date().toISOString(),
                    isPublic: isPublic,
                    uploadedBy: localStorage.getItem('username'),
                    // In a real application, you would store the file
                    // For this demo, we'll just store the metadata
                    fileUrl: URL.createObjectURL(file)
                };
                
                // Save to localStorage
                saveVideo(video);
                
                // Reset form and hide progress
                uploadForm.reset();
                uploadProgress.style.display = 'none';
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
                
                // Reload videos list
                loadVideos();
                
                alert('Video uploaded successfully!');
            } else {
                progressBar.style.width = progress + '%';
                progressText.textContent = progress + '%';
            }
        }, 200);
    }
    
    function saveVideo(video) {
        let videos = JSON.parse(localStorage.getItem('videos')) || [];
        videos.push(video);
        localStorage.setItem('videos', JSON.stringify(videos));
    }
    
    function loadVideos() {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        videosList.innerHTML = '';
        
        if (videos.length === 0) {
            videosList.innerHTML = '<p>No videos uploaded yet.</p>';
            return;
        }
        
        // Filter videos by uploader (admin sees all, users see only their own)
        const currentUser = localStorage.getItem('username');
        const userRole = localStorage.getItem('userRole');
        
        let filteredVideos = videos;
        if (userRole !== 'admin') {
            filteredVideos = videos.filter(video => video.uploadedBy === currentUser);
        }
        
        filteredVideos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            
            videoCard.innerHTML = `
                <div class="video-thumbnail">Video Preview</div>
                <div class="video-info-card">
                    <h4>${video.title}</h4>
                    <p>${video.description || 'No description'}</p>
                    <p><small>Uploaded by: ${video.uploadedBy}</small></p>
                    <p><small>Visibility: ${video.isPublic ? 'Public' : 'Private'}</small></p>
                    <p><small>Uploaded: ${new Date(video.uploadDate).toLocaleDateString()}</small></p>
                    <div class="video-actions">
                        <a href="watch.html?id=${video.id}">Watch</a>
                        <button onclick="toggleVideoVisibility(${video.id}, ${video.isPublic})">
                            Make ${video.isPublic ? 'Private' : 'Public'}
                        </button>
                        <button onclick="deleteVideo(${video.id})">Delete</button>
                    </div>
                </div>
            `;
            
            videosList.appendChild(videoCard);
        });
    }
    
    // Make functions available globally
    window.deleteVideo = function(id) {
        if (confirm('Are you sure you want to delete this video?')) {
            let videos = JSON.parse(localStorage.getItem('videos')) || [];
            videos = videos.filter(video => video.id !== id);
            localStorage.setItem('videos', JSON.stringify(videos));
            loadVideos();
        }
    };
    
    window.toggleVideoVisibility = function(id, isCurrentlyPublic) {
        let videos = JSON.parse(localStorage.getItem('videos')) || [];
        const videoIndex = videos.findIndex(video => video.id === id);
        
        if (videoIndex !== -1) {
            videos[videoIndex].isPublic = !isCurrentlyPublic;
            localStorage.setItem('videos', JSON.stringify(videos));
            loadVideos();
        }
    };
});