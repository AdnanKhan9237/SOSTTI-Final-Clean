document.addEventListener("DOMContentLoaded", function () {
  // Create popup HTML with course batch information
  const popupHTML = `
    <div id="applyPopup" aria-modal="true" aria-labelledby="popupTitle">
      <div id="popupContent">
        <button id="closePopup" aria-label="Close popup">&times;</button>
        <h2 id="popupTitle">Ready to Join?</h2>
        
        <div id="batchInfo">
          <div class="course-type">
            <h3>6-Month Course Batches (2 per year)</h3>
            <ul>
              <li>January to June</li>
              <li>July to December</li>
            </ul>
          </div>
          <div class="course-type">
            <h3>3-Month Course Batches (4 per year)</h3>
            <ul>
              <li>January to March</li>
              <li>April to June</li>
              <li>July to September</li>
              <li>October to December</li>
            </ul>
          </div>
        </div>
        
        <button id="applyNow">Apply Now</button>
      </div>
    </div>
  `;

  // Add popup to body
  document.body.insertAdjacentHTML("beforeend", popupHTML);

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --bg-color: #fff;
      --text-color: #333;
      --primary-color: #007bff;
      --primary-hover: #0056b3;
      --border-color: #e0e0e0;
      --batch-bg: #f8f9fa;
      --close-bg: #fff;
      --close-color: #888;
      --shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
    }

    .dark-mode {
      --bg-color: #1e1e1e;
      --text-color: #f0f0f0;
      --primary-color: #4a9dff;
      --primary-hover: #2d8cff;
      --border-color: #444;
      --batch-bg: #2d2d2d;
      --close-bg: #1e1e1e;
      --close-color: #b0b0b0;
      --shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
    }

    #applyPopup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--bg-color);
      padding: 30px;
      border-radius: 15px;
      box-shadow: var(--shadow);
      text-align: center;
      z-index: 9999;
      width: 90%;
      max-width: 500px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
      color: var(--text-color);
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
      color: var(--text-color);
      margin-top: 0;
    }

    #batchInfo {
      text-align: left;
      margin-bottom: 25px;
      background: var(--batch-bg);
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid var(--primary-color);
    }

    .course-type {
      margin-bottom: 15px;
    }

    .course-type:last-child {
      margin-bottom: 0;
    }

    .course-type h3 {
      font-size: 1rem;
      color: var(--primary-color);
      margin-bottom: 8px;
      font-weight: 600;
    }

    .course-type ul {
      list-style-type: none;
      padding-left: 0;
      margin: 0;
    }

    .course-type li {
      padding: 4px 0;
      font-size: 0.9rem;
      color: var(--text-color);
      position: relative;
      padding-left: 15px;
    }

    .course-type li:before {
      content: "•";
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }

    #applyNow {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s;
      font-weight: 600;
      width: 100%;
    }

    #applyNow:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
    }

    #closePopup {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--close-bg);
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      color: var(--close-color);
      transition: all 0.3s;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    #closePopup:hover {
      color: var(--text-color);
      background: var(--batch-bg);
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

    #applyPopup.minimized #batchInfo {
      display: none;
    }

    #applyPopup.minimized #applyNow {
      padding: 8px 20px;
      font-size: 0.9rem;
      width: 100%;
    }

    /* Dark mode toggle button */
    .dark-mode-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      z-index: 10000;
      font-size: 0.9rem;
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
      
      .dark-mode-toggle {
        top: 10px;
        right: 10px;
        padding: 8px 12px;
        font-size: 0.8rem;
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
      
      .course-type h3 {
        font-size: 0.9rem;
      }
      
      .course-type li {
        font-size: 0.85rem;
      }
      
      #batchInfo {
        padding: 12px;
      }
    }

    @media (max-width: 360px) {
      #applyPopup {
        width: 95%;
        padding: 15px 10px;
      }
      
      #applyPopup.minimized {
        width: 120px;
        height: 40px;
      }
      
      #popupContent h2 {
        font-size: 1.2rem;
      }
      
      #applyNow {
        padding: 8px 20px;
        font-size: 0.85rem;
      }
    }
  `;
  document.head.appendChild(style);

  // Add dark mode toggle button
  const darkModeToggle = document.createElement('button');
  darkModeToggle.className = 'dark-mode-toggle';
  darkModeToggle.textContent = 'Toggle Dark Mode';
  document.body.appendChild(darkModeToggle);

  const popup = document.getElementById("applyPopup");
  const closeBtn = document.getElementById("closePopup");
  const applyBtn = document.getElementById("applyNow");

  let hasPopupBeenShown = false;
  let hasPopupBeenMinimized = false;
  let isDarkMode = false;

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

  // Toggle dark mode
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
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

  // Dark mode toggle
  darkModeToggle.addEventListener('click', toggleDarkMode);
});