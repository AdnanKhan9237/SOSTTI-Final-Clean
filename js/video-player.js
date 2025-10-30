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

    // Create fullscreen button
    let fullscreenBtn = videoWrapper.querySelector('.fullscreen-btn');
    if (!fullscreenBtn) {
        fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'control-btn fullscreen-btn';
        fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
        fullscreenBtn.innerHTML = '⛶';
        
        const controlsContainer = videoWrapper.querySelector('.video-controls');
        if (controlsContainer) {
            controlsContainer.appendChild(fullscreenBtn);
        }
    }

    let isPlaying = false;
    let hideControlsTimeout;

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

    function togglePlayPause() {
        if (isPlaying) {
            video.pause();
            playPauseBtn.textContent = '▶';
        } else {
            video.play().catch(e => console.log('', e));
            playPauseBtn.textContent = '❚❚';
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
            videoWrapper.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
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
    });

    videoWrapper.addEventListener('mousemove', showControlsTemporarily);

    // Initialize
    setTimeout(() => {
        if (videoWrapper.classList.contains('loading')) {
            videoWrapper.classList.remove('loading');
            loadingText.classList.add('hidden');
        }
    }, 5000);
}

// Initialize when page loads
window.addEventListener('load', initVideoPlayer);