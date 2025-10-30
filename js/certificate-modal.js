// ===============================================
// CERTIFICATE MODAL – FULLY SELF-CONTAINED
// HTML + CSS + JS in one file
// Image pushed down with top margin
// ===============================================

(() => {
  // === 1. INJECT HTML + CSS ===
  const injectModal = () => {
    const modalHTML = `
      <div id="certificateModal" class="certificate-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Certificate Viewer</h3>
            <button class="close-modal" aria-label="Close">X</button>
          </div>
          <div class="modal-body">
            <img id="modalImage" src="" alt="Certificate" draggable="false">
          </div>
          <div class="modal-footer">
            <button id="zoomIn"  class="btn-zoom">Zoom In</button>
            <button id="zoomOut" class="btn-zoom">Zoom Out</button>
            <button id="resetZoom" class="btn-zoom">Reset</button>
          </div>
        </div>
      </div>
    `;

    const modalCSS = `
      <style>
        /* MODAL CONTAINER */
        .certificate-modal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9999;
          padding: 15px;
          overflow: auto;
          align-items: center;
          justify-content: center;
        }
        .certificate-modal.active { display: flex; }

        /* MODAL BOX */
        .modal-content {
          background: white;
          border-radius: 18px;
          width: 100%;
          max-width: 900px;
          max-height: 95dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 80px rgba(0,0,0,.3);
          overflow: hidden;
          animation: modalPop .35s ease-out;
        }
        @keyframes modalPop {
          from { opacity:0; transform:scale(.9); }
          to   { opacity:1; transform:scale(1); }
        }

        /* HEADER */
        .modal-header {
          padding: 18px 22px;
          background: linear-gradient(135deg, var(--primary, #00aaff), var(--primary-dark, #0077cc));
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .modal-header h3 { margin:0; font-size:1.35rem; font-weight:600; }
        .close-modal {
          background:none; border:none; color:white; font-size:1.9rem;
          width:44px; height:44px; display:flex; align-items:center;
          justify-content:center; border-radius:50%; cursor:pointer;
          transition:.3s;
        }
        .close-modal:hover { background:rgba(255,255,255,.25); }

        /* BODY – IMAGE */
        .modal-body {
          flex: 1;
          padding: 20px;
          background:#fafafa;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:auto;
          min-height:200px;
          scroll-behavior:smooth;
          -webkit-overflow-scrolling:touch;
        }
        #modalImage {
          max-width:100%;
          max-height:100%;
          width:auto;
          height:auto;
          object-fit:contain;
          object-position:center;
          border-radius:12px;
          box-shadow:0 12px 35px rgba(0,0,0,.18);
          transition:transform .3s ease;
          transform-origin:center;
          margin-top: 150px;     /* PUSH IMAGE DOWN */
          margin-bottom: 50px;  /* BALANCE BOTTOM */
        }

        /* FOOTER – BUTTONS */
        .modal-footer {
          padding:18px 20px;
          background:#f5f5f5;
          border-top:1px solid #eee;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
          flex-shrink:0;
        }
        .btn-zoom {
          background:white;
          color:var(--primary-dark, #0077cc);
          border:2.2px solid var(--primary, #00aaff);
          padding:11px 22px;
          border-radius:50px;
          font-weight:600;
          font-size:0.95rem;
          cursor:pointer;
          transition:all .3s ease;
          min-width:100px;
        }
        .btn-zoom:hover {
          background:var(--primary, #00aaff);
          color:white;
          transform:translateY(-2px);
          box-shadow:0 6px 18px rgba(0,122,255,.3);
        }

        /* RESPONSIVE */
        @media (max-width:992px) {
          .modal-content { max-width:95%; max-height:92dvh; border-radius:16px; }
          .modal-header { padding:16px 20px; }
          .modal-header h3 { font-size:1.25rem; }
          .modal-body { padding:16px; }
          #modalImage { margin-top: 40px; margin-bottom: 40px; }
        }
        @media (max-width:576px) {
          .certificate-modal { padding:10px; }
          .modal-content { max-height:94dvh; }
          .modal-header { padding:14px 18px; }
          .modal-header h3 { font-size:1.15rem; }
          .close-modal { width:40px; height:40px; font-size:1.7rem; }
          .modal-body { padding:12px; }
          .modal-footer { padding:14px 16px; gap:10px; }
          .btn-zoom { padding:10px 18px; font-size:0.9rem; flex:1; min-width:80px; }
          #modalImage { margin-top: 30px; margin-bottom: 30px; }
        }

        /* BLOCK DOWNLOAD & DRAG */
        #modalImage, .modal-body {
          -webkit-user-drag:none;
          -khtml-user-drag:none;
          -moz-user-drag:none;
          -o-user-drag:none;
          -webkit-touch-callout:none;
          -webkit-user-select:none;
          -khtml-user-select:none;
          -moz-user-select:none;
          -ms-user-select:none;
          user-select:none;
          pointer-events:auto;
        }
        @media print { .certificate-modal, body > * { display:none !important; } }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML + modalCSS);
  };

  // === 2. INITIALIZE MODAL ===
  const initModal = () => {
    const modal     = document.getElementById('certificateModal');
    const img       = document.getElementById('modalImage');
    const modalBody = document.querySelector('.modal-body');
    const closeBtn  = document.querySelector('.close-modal');
    const zoomIn    = document.getElementById('zoomIn');
    const zoomOut   = document.getElementById('zoomOut');
    const resetZoom = document.getElementById('resetZoom');
    let scale = 1;
    const STEP = 0.3;
    const MIN = 0.5;
    const MAX = 4;

    const resetView = () => {
      scale = 1;
      img.style.transform = 'scale(1)';
      modalBody.scrollTop = 0;
      modalBody.scrollLeft = 0;
    };

    // Open modal
    document.querySelectorAll('.btn-certificate').forEach(btn => {
      btn.addEventListener('click', () => {
        img.src = btn.dataset.certificate;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetView();
      });
    });

    // Close modal
    const close = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      img.src = '';
      resetView();
    };
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    // Zoom + Auto-center
    const update = () => {
      img.style.transform = `scale(${scale})`;
      setTimeout(() => {
        const r = img.getBoundingClientRect();
        const p = modalBody.getBoundingClientRect();
        if (r.width > p.width) modalBody.scrollLeft = (r.width - p.width) / 2;
        if (r.height > p.height) modalBody.scrollTop = (r.height - p.height) / 2;
      }, 50);
    };

    zoomIn.addEventListener('click', () => { scale = Math.min(scale + STEP, MAX); update(); });
    zoomOut.addEventListener('click', () => { scale = Math.max(scale - STEP, MIN); update(); });
    resetZoom.addEventListener('click', () => { scale = 1; update(); modalBody.scrollTop = 0; modalBody.scrollLeft = 0; });

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
  };

  // === 3. RUN ON LOAD ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectModal();
      initModal();
    });
  } else {
    injectModal();
    initModal();
  }
})();