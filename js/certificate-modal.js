document.addEventListener('DOMContentLoaded', () => {
  const modal      = document.getElementById('certificateModal');
  const img        = document.getElementById('modalImage');
  const download   = document.getElementById('downloadBtn');
  const closeBtn   = document.querySelector('.close-modal');
  const zoomIn     = document.getElementById('zoomIn');
  const zoomOut    = document.getElementById('zoomOut');
  let scale = 1;

  // Open
  document.querySelectorAll('.btn-certificate').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.certificate;
      img.src = src;
      download.href = src;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      scale = 1;
      img.style.transform = 'scale(1)';
    });
  });

  // Close
  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  // Zoom
  zoomIn.addEventListener('click', () => {
    scale = Math.min(scale + 0.2, 3);
    img.style.transform = `scale(${scale})`;
  });
  zoomOut.addEventListener('click', () => {
    scale = Math.max(scale - 0.2, 0.5);
    img.style.transform = `scale(${scale})`;
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') zoomIn.click();
    if (e.key === '-') zoomOut.click();
  });
});