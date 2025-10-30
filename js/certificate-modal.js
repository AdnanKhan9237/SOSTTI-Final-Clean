document.addEventListener('DOMContentLoaded', () => {
  const modal     = document.getElementById('certificateModal');
  const img       = document.getElementById('modalImage');
  const closeBtn  = document.querySelector('.close-modal');
  const zoomIn    = document.getElementById('zoomIn');
  const zoomOut   = document.getElementById('zoomOut');
  const resetZoom = document.getElementById('resetZoom');
  let scale = 1;
  const STEP = 0.3;
  const MIN = 0.5;
  const MAX = 4;

  // Open
  document.querySelectorAll('.btn-certificate').forEach(btn => {
    btn.addEventListener('click', () => {
      img.src = btn.dataset.certificate;
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
    img.src = '';
  };
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  // Zoom
  const update = () => img.style.transform = `scale(${scale})`;
  zoomIn.addEventListener('click', () => { scale = Math.min(scale + STEP, MAX); update(); });
  zoomOut.addEventListener('click', () => { scale = Math.max(scale - STEP, MIN); update(); });
  resetZoom.addEventListener('click', () => { scale = 1; update(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') zoomIn.click();
    if (e.key === '-') zoomOut.click();
    if (e.key === '0') resetZoom.click();
  });

  // Block download
  img.addEventListener('contextmenu', e => e.preventDefault());
  img.addEventListener('dragstart', e => e.preventDefault());
});