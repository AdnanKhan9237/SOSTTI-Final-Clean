// Video Player Functionality
function initVideoPlayer() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) {
        console.log('Video wrapper not found');
        return;
    }

    const video = videoWrapper.querySelector('video');
    const playPauseBtn = videoWrapper.querySelector('.play-pause-btn');
    const progressBar = videoWrapper.querySelector('.progress');
    const timeDisplay = videoWrapper.querySelector('.time-display');
    const loadingText = videoWrapper.querySelector('.loading-text');
    const volumeBtn = videoWrapper.querySelector('.volume');
    const progressContainer = videoWrapper.querySelector('.progress-bar');

    // Check if all elements exist
    if (!video || !playPauseBtn || !progressBar || !timeDisplay || !loadingText || !volumeBtn || !progressContainer) {
        console.log('Missing video elements');
        return;
    }

    // Create fullscreen button
    let fullscreenBtn = videoWrapper.querySelector('.fullscreen-btn');
    if (!fullscreenBtn) {
        fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn control-btn';
        fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
        fullscreenBtn.innerHTML = '⛶';
        
        const controlsContainer = videoWrapper.querySelector('.video-controls');
        if (controlsContainer) {
            controlsContainer.appendChild(fullscreenBtn);
        }
    }

    let isPlaying = false;
    let hideControlsTimeout;
    let hidePlayButtonTimeout;

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgress() {
        if (video.duration && !isNaN(video.duration)) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
    }

    function showControlsTemporarily() {
        videoWrapper.classList.add('controls-visible');
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            if (isPlaying) {
                videoWrapper.classList.remove('controls-visible');
            }
        }, 3000);
    }

    function hidePlayButton() {
        clearTimeout(hidePlayButtonTimeout);
        hidePlayButtonTimeout = setTimeout(() => {
            if (isPlaying) {
                playPauseBtn.classList.add('hidden');
            }
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
            video.play().then(() => {
                isPlaying = true;
                playPauseBtn.textContent = '❚❚';
                hidePlayButton();
            }).catch(error => {
                console.log('Play failed:', error);
                showPlayButton();
            });
        }
        isPlaying = !isPlaying;
        showControlsTemporarily();
    }

    function setProgress(e) {
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = this.clientWidth;
        const duration = video.duration;
        
        if (duration && !isNaN(duration)) {
            video.currentTime = (clickX / width) * duration;
            showControlsTemporarily();
        }
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

    function handleFullscreenChange() {
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = '⛷';
        } else {
            fullscreenBtn.innerHTML = '⛶';
        }
    }

    // Event listeners
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayPause();
    });
    
    video.addEventListener('click', togglePlayPause);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('progress', updateProgress);
    
    progressContainer.addEventListener('click', setProgress);
    volumeBtn.addEventListener('click', toggleVolume);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    video.addEventListener('loadeddata', function() {
        videoWrapper.classList.remove('loading');
        loadingText.classList.add('hidden');
        
        if (video.duration && !isNaN(video.duration)) {
            timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
        }
        
        // Auto-play with error handling
        video.play().then(() => {
            isPlaying = true;
            playPauseBtn.textContent = '❚❚';
            hidePlayButton();
        }).catch(error => {
            console.log('Auto-play failed:', error);
            showPlayButton();
            isPlaying = false;
            playPauseBtn.textContent = '▶';
        });
    });

    video.addEventListener('ended', () => {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        showPlayButton();
        videoWrapper.classList.remove('controls-visible');
    });

    video.addEventListener('waiting', () => {
        videoWrapper.classList.add('loading');
    });

    video.addEventListener('canplay', () => {
        videoWrapper.classList.remove('loading');
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

    // Keyboard controls
    videoWrapper.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initVideoPlayer();
});

// Also initialize on window load as backup
window.addEventListener('load', function() {
    // Re-initialize in case video wasn't ready
    setTimeout(initVideoPlayer, 100);
});