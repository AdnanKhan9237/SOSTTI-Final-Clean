// Video Player Functionality
function initVideoPlayer() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const video = videoWrapper.querySelector('video');
    const playPauseBtn = videoWrapper.querySelector('.play-pause-btn');
    const progressBar = videoWrapper.querySelector('.progress');
    const timeDisplay = videoWrapper.querySelector('.time-display');
    const loadingText = videoWrapper.querySelector('.loading-text');
    const volumeBtn = videoWrapper.querySelector('.volume');
    const progressContainer = videoWrapper.querySelector('.progress-bar');
    
    // Create fullscreen button if it doesn't exist
    let fullscreenBtn = videoWrapper.querySelector('.fullscreen-btn');
    if (!fullscreenBtn) {
        fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.textContent = '⛶';
        fullscreenBtn.style.background = 'none';
        fullscreenBtn.style.border = 'none';
        fullscreenBtn.style.color = 'white';
        fullscreenBtn.style.fontSize = '16px';
        fullscreenBtn.style.cursor = 'pointer';
        fullscreenBtn.style.padding = '5px';
        
        // Find controls container or create one
        const controlsContainer = videoWrapper.querySelector('.video-controls') || progressContainer.parentElement;
        if (controlsContainer) {
            controlsContainer.appendChild(fullscreenBtn);
        }
    }

    let isPlaying = false;
    let hideControlsTimeout;
    let hidePlayButtonTimeout;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgress() {
        if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
    }

    function showControlsTemporarily() {
        videoWrapper.classList.add('controls-visible');
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            if (isPlaying) videoWrapper.classList.remove('controls-visible');
        }, 3000);
    }

    function hidePlayButton() {
        clearTimeout(hidePlayButtonTimeout);
        hidePlayButtonTimeout = setTimeout(() => {
            if (isPlaying) playPauseBtn.classList.add('hidden');
        }, 500);
    }

    function showPlayButton() {
        clearTimeout(hidePlayButtonTimeout);
        playPauseBtn.classList.remove('hidden');
    }

    function togglePlayPause() {
        if (isPlaying) {
            video.pause();
            playPauseBtn.textContent = '▶';
            showPlayButton();
        } else {
            video.play().catch(e => console.log('Play failed:', e));
            playPauseBtn.textContent = '❚❚';
            hidePlayButton();
        }
        isPlaying = !isPlaying;
        showControlsTemporarily();
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = video.duration;
        video.currentTime = (clickX / width) * duration;
        showControlsTemporarily();
    }

    function toggleVolume() {
        video.volume = video.volume > 0 ? 0 : 1;
        volumeBtn.textContent = video.volume > 0 ? '🔊' : '🔇';
        showControlsTemporarily();
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen();
            } else if (videoWrapper.webkitRequestFullscreen) {
                videoWrapper.webkitRequestFullscreen();
            } else if (videoWrapper.msRequestFullscreen) {
                videoWrapper.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        showControlsTemporarily();
    }

    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    video.addEventListener('click', togglePlayPause);
    video.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    volumeBtn.addEventListener('click', toggleVolume);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    video.addEventListener('loadeddata', function() {
        videoWrapper.classList.remove('loading');
        loadingText.classList.add('hidden');
        timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
        video.play().then(() => {
            isPlaying = true;
            playPauseBtn.textContent = '❚❚';
            hidePlayButton();
        }).catch(() => showPlayButton());
    });

    video.addEventListener('ended', () => {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        showPlayButton();
    });

    videoWrapper.addEventListener('mousemove', () => {
        if (isPlaying) {
            showControlsTemporarily();
            showPlayButton();
        }
    });

    videoWrapper.addEventListener('mouseleave', () => {
        if (isPlaying) {
            videoWrapper.classList.remove('controls-visible');
            hidePlayButton();
        }
    });

    // Fallback: remove loading after 5s
    setTimeout(() => {
        if (videoWrapper.classList.contains('loading')) {
            videoWrapper.classList.remove('loading');
            loadingText.classList.add('hidden');
        }
    }, 5000);
}

// Video responsive fix
function fixVideoResponsive() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
        const iframe = videoWrapper.querySelector('iframe');
        if (iframe) {
            iframe.removeAttribute('height');
            iframe.style.height = '100%';
        }
    }
}

// Initialize when page loads
window.addEventListener('load', function() {
    initVideoPlayer();
    fixVideoResponsive();
});