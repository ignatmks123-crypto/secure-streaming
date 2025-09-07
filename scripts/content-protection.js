// Content protection measures
// Note: True DRM requires server-side infrastructure
// This implements client-side protections to discourage downloading

document.addEventListener('DOMContentLoaded', function() {
    // Only apply protection on the watch page
    if (!window.location.pathname.includes('watch.html')) return;
    
    const videoElement = document.getElementById('secureVideo');
    if (!videoElement) return;
    
    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable keyboard shortcuts for saving and developer tools
    document.addEventListener('keydown', function(e) {
        // Disable Ctrl+S, Ctrl+Shift+I, F12, etc.
        if (
            (e.ctrlKey && e.key === 's') || 
            (e.ctrlKey && e.key === 'u') || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            e.key === 'F12'
        ) {
            e.preventDefault();
            return false;
        }
    });
    
    // Add transparent overlay to prevent right-click on video
    const overlay = document.querySelector('.protection-overlay');
    if (overlay) {
        overlay.style.display = 'block';
    }
    
    // Monitor for developer tools opening (basic detection)
    let devToolsOpen = false;
    
    setInterval(function() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (!devToolsOpen && (widthThreshold || heightThreshold)) {
            devToolsOpen = true;
            alert('Developer tools detected. Content protection is active.');
            // In a real application, you might pause video playback
            if (!videoElement.paused) {
                videoElement.pause();
            }
        }
    }, 1000);
    
    // Prevent video download by removing source when page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, remove video source
            const currentTime = videoElement.currentTime;
            const src = videoElement.src;
            videoElement.src = '';
            
            // Restore when page is visible again
            document.addEventListener('visibilitychange', function handler() {
                if (!document.hidden) {
                    videoElement.src = src;
                    videoElement.currentTime = currentTime;
                    document.removeEventListener('visibilitychange', handler);
                }
            });
        }
    });
    
    console.log('Content protection enabled');
});