// Certificate Modal System
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('modalImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const closeBtn = document.querySelector('.close-modal');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    let scale = 1;

    // Open Modal
    document.querySelectorAll('.btn-certificate').forEach(btn => {
        btn.addEventListener('click', function () {
            const certUrl = this.getAttribute('data-certificate');
            modalImg.src = certUrl;
            downloadBtn.href = certUrl;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            scale = 1;
            modalImg.style.transform = 'scale(1)';
        });
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // Zoom Controls
    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale + 0.2, 3);
        modalImg.style.transform = `scale(${scale})`;
    });

    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - 0.2, 0.5);
        modalImg.style.transform = `scale(${scale})`;
    });

    // Keyboard Support
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === '+' || e.key === '=') zoomInBtn.click();
        if (e.key === '-') zoomOutBtn.click();
    });
});