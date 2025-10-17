document.addEventListener("DOMContentLoaded", function () {
  // Create popup HTML with overlay
  const popupHTML = `
    <div id="popupOverlay">
      <div id="applyPopup" aria-modal="true" aria-labelledby="popupTitle">
        <div id="popupContent">
          <button id="closePopup" aria-label="Close popup">&times;</button>
          <h2 id="popupTitle">Ready to Join?</h2>
          <button id="applyNow">Apply Now</button>
        </div>
      </div>
    </div>
  `;

  // Add popup to body
  document.body.insertAdjacentHTML("beforeend", popupHTML);

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #popupOverlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    #popupOverlay.show {
      display: block;
      opacity: 1;
    }

    #applyPopup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
      text-align: center;
      z-index: 9999;
      width: 90%;
      max-width: 400px;
      opacity: 0;
      transition: all 0.4s ease;
    }

    #applyPopup.show {
      opacity: 1;
    }

    #popupContent {
      position: relative;
    }

    #popupContent h2 {
      margin-bottom: 20px;
      font-size: 1.6rem;
      color: #333;
      margin-top: 0;
    }

    #applyNow {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
      font-weight: 600;
    }

    #applyNow:hover {
      background: #0056b3;
      transform: translateY(-2px);
    }

    #closePopup {
      position: absolute;
      top: -10px;
      right: -10px;
      background: #fff;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      color: #888;
      transition: all 0.3s;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    #closePopup:hover {
      color: #333;
      background: #f8f9fa;
      transform: scale(1.1);
    }

    #applyPopup.minimized {
      top: auto;
      left: 20px;
      bottom: 20px;
      transform: none;
      width: 180px;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      opacity: 1;
    }

    #applyPopup.minimized h2 {
      display: none;
    }

    #applyPopup.minimized #closePopup {
      display: none;
    }

    @media (max-width: 768px) {
      #applyPopup {
        width: 85%;
        padding: 25px 20px;
      }
      
      #applyPopup.minimized {
        width: 160px;
        left: 10px;
        bottom: 10px;
        padding: 12px;
      }
      
      #popupContent h2 {
        font-size: 1.4rem;
      }
    }

    @media (max-width: 480px) {
      #applyPopup {
        width: 90%;
        padding: 20px 15px;
      }
      
      #applyPopup.minimized {
        width: 140px;
      }
      
      #popupContent h2 {
        font-size: 1.3rem;
      }
      
      #applyNow {
        padding: 10px 25px;
        font-size: 0.9rem;
      }
    }
  `;
  document.head.appendChild(style);

  const popupOverlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("applyPopup");
  const closeBtn = document.getElementById("closePopup");
  const applyBtn = document.getElementById("applyNow");

  // Throttle function for scroll performance
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Show popup function
  function showPopup() {
    popupOverlay.classList.add('show');
    popup.classList.add('show');
    // Trap focus inside popup for accessibility
    popup.setAttribute('tabindex', '0');
    popup.focus();
  }

  // Hide popup function (minimize)
  function hidePopup() {
    popup.classList.add('minimized');
    // Remove overlay when minimized
    setTimeout(() => {
      popupOverlay.classList.remove('show');
    }, 300);
  }

  // Show popup after 70% scroll - REMOVED SESSION STORAGE CHECK
  const scrollHandler = throttle(function () {
    const scrollPercent = ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100;
    
    if (scrollPercent >= 70 && !popup.classList.contains('minimized') && !popupOverlay.classList.contains('show')) {
      showPopup();
    }
  }, 100);

  window.addEventListener("scroll", scrollHandler);

  // Also show popup after 5 seconds if user hasn't scrolled
  setTimeout(() => {
    if (!popup.classList.contains('minimized') && !popupOverlay.classList.contains('show')) {
      showPopup();
    }
  }, 5000);

  // Close (minimize) popup
  closeBtn.addEventListener("click", hidePopup);

  // Close popup when clicking on overlay
  popupOverlay.addEventListener("click", function(e) {
    if (e.target === popupOverlay) {
      hidePopup();
    }
  });

  // Close with Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && popupOverlay.classList.contains('show')) {
      hidePopup();
    }
  });

  // Apply Now button
  applyBtn.addEventListener("click", function () {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSdnJItkIMyt3SGNaDeTBDcMTBKNeKJ4lC8cx3wxSOvjpciX4g/viewform",
      "_blank"
    );
    // Optionally minimize after applying
    hidePopup();
  });

  // Handle minimized popup click to expand
  popup.addEventListener('click', function(e) {
    if (popup.classList.contains('minimized') && e.target !== applyBtn) {
      popup.classList.remove('minimized');
      showPopup();
    }
  });

  // Prevent body scroll when popup is open
  const originalOverflow = document.body.style.overflow;
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        if (popupOverlay.classList.contains('show')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = originalOverflow;
        }
      }
    });
  });

  observer.observe(popupOverlay, { attributes: true });
});