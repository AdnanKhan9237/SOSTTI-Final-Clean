document.addEventListener("DOMContentLoaded", function () {
  // Create popup HTML
  const popupHTML = `
    <div id="applyPopup">
      <div id="popupContent">
        <button id="closePopup">&times;</button>
        <h2>Ready to Join?</h2>
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
      display: none;
      transition: all 0.4s ease;
    }

    #popupContent h2 {
      margin-bottom: 20px;
      font-size: 1.6rem;
      color: #333;
    }

    #applyNow {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 25px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    #applyNow:hover {
      background: #0056b3;
    }

    #closePopup {
      position: absolute;
      top: 8px;
      right: 12px;
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: #888;
      transition: color 0.3s;
    }

    #closePopup:hover {
      color: #333;
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
    }

    #applyPopup.minimized h2 {
      display: none;
    }

    #applyPopup.minimized #closePopup {
      display: none;
    }

    @keyframes fadeInPopup {
      from { opacity: 0; transform: translate(-50%, -60%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }

    #applyPopup.show {
      animation: fadeInPopup 0.4s ease;
    }
  `;
  document.head.appendChild(style);

  const popup = document.getElementById("applyPopup");
  const closeBtn = document.getElementById("closePopup");
  const applyBtn = document.getElementById("applyNow");

  // Show popup after 70% scroll
  window.addEventListener("scroll", function () {
    const scrollPercent =
      ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100;

    if (scrollPercent >= 70 && !sessionStorage.getItem("popupShown")) {
      popup.style.display = "block";
      popup.classList.add("show");
      sessionStorage.setItem("popupShown", "true");
    }
  });

  // Close (minimize) popup
  closeBtn.addEventListener("click", function () {
    popup.classList.add("minimized");
  });

  // Apply Now button
  applyBtn.addEventListener("click", function () {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSdnJItkIMyt3SGNaDeTBDcMTBKNeKJ4lC8cx3wxSOvjpciX4g/viewform",
      "_blank"
    );
  });
});
