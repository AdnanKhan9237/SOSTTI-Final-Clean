document.addEventListener("DOMContentLoaded", function () {
  // Create popup HTML
  const popupHTML = `
    <div id="applyPopup" aria-modal="true" aria-labelledby="popupTitle">
      <div id="popupContent">
        <button id="closePopup" aria-label="Close popup">&times;</button>
        <h2 id="popupTitle">Ready to Join?</h2>
        <button id="applyNow">Apply Now</button>
      </div>
    </div>
  `;

  // Add popup to body
  document.body.insertAdjacentHTML("beforeend", popupHTML);

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
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
      visibility: hidden;
      transition: all 0.4s ease;
    }

    #applyPopup.show {
      opacity: 1;
      visibility: visible;
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
      top: auto !important;
      left: 20px !important;
      bottom: 20px !important;
      transform: none !important;
      width: 180px;
      height: 60px;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      opacity: 1;
      visibility: visible;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    #applyPopup.minimized h2 {
      display: none;
    }

    #applyPopup.minimized #closePopup {
      display: none;
    }

    #applyPopup.minimized #applyNow {
      padding: 8px 20px;
      font-size: 0.9rem;
      width: 100%;
    }

    @media (max-width: 768px) {
      #applyPopup {
        width: 85%;
        padding: 25px 20px;
      }
      
      #applyPopup.minimized {
        width: 160px;
        left: 10px !important;
        bottom: 10px !important;
        height: 50px;
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
        height: 45px;
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

  const popup = document.getElementById("applyPopup");
  const closeBtn = document.getElementById("closePopup");
  const applyBtn = document.getElementById("applyNow");

  let hasPopupBeenShown = false;
  let hasPopupBeenMinimized = false;

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
    if (!hasPopupBeenMinimized) {
      popup.classList.add('show');
      hasPopupBeenShown = true;
    }
  }

  // Minimize popup function
  function minimizePopup() {
    popup.classList.add('minimized');
    popup.classList.remove('show');
    hasPopupBeenMinimized = true;
  }

  // Expand minimized popup
  function expandPopup() {
    if (popup.classList.contains('minimized')) {
      popup.classList.remove('minimized');
      popup.classList.add('show');
      hasPopupBeenMinimized = false;
    }
  }

  // Show popup only after 70% scroll
  const scrollHandler = throttle(function () {
    if (hasPopupBeenShown || hasPopupBeenMinimized) return;
    
    const scrollPercent = ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100;
    
    if (scrollPercent >= 70) {
      showPopup();
    }
  }, 100);

  window.addEventListener("scroll", scrollHandler);

  // Close (minimize) popup
  closeBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    minimizePopup();
  });

  // Apply Now button
  applyBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSdnJItkIMyt3SGNaDeTBDcMTBKNeKJ4lC8cx3wxSOvjpciX4g/viewform",
      "_blank"
    );
  });

  // Click on minimized popup to expand
  popup.addEventListener('click', function(e) {
    if (popup.classList.contains('minimized')) {
      expandPopup();
    }
  });

  // Close with Escape key only when expanded
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && popup.classList.contains('show') && !popup.classList.contains('minimized')) {
      minimizePopup();
    }
  });
});