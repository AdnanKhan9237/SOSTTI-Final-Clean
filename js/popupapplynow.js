document.addEventListener("DOMContentLoaded", function() {

    // ✅ Works for any page inside /pages/courses/
    if (window.location.pathname.includes("/pages/courses/")) {

        const scrollTrigger = 70; // trigger after 40% scroll
        let popupShown = false;

        window.addEventListener("scroll", function() {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.scrollHeight;
            const scrolled = (scrollTop + windowHeight) / fullHeight * 100;

            if (scrolled >= scrollTrigger && !popupShown) {
                popupShown = true;
                showPopup();
            }
        });

        function showPopup() {
            const popup = document.createElement("div");
            popup.innerHTML = `
                <div id="applyOverlay" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                ">
                    <div style="
                        background: #fff;
                        padding: 35px 30px;
                        border-radius: 16px;
                        max-width: 420px;
                        width: 90%;
                        text-align: center;
                        box-shadow: 0 6px 25px rgba(0,0,0,0.25);
                        animation: scaleUp 0.3s ease;
                        position: relative;
                    ">
                        <h2 style="margin-bottom: 10px; color: #222;">Ready to join SOS Technical Training Institute?</h2>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdnJItkIMyt3SGNaDeTBDcMTBKNeKJ4lC8cx3wxSOvjpciX4g/viewform"
                           target="_blank"
                           style="
                               display: inline-block;
                               background: #007bff;
                               color: #fff;
                               padding: 10px 25px;
                               border-radius: 6px;
                               text-decoration: none;
                               font-weight: 500;
                               transition: background 0.3s ease;
                           "
                           onmouseover="this.style.background='#0056b3'"
                           onmouseout="this.style.background='#007bff'">
                           Apply Now
                        </a>
                        <button id="closePopup" style="
                            position: absolute;
                            top: 10px;
                            right: 15px;
                            background: none;
                            border: none;
                            font-size: 20px;
                            color: #777;
                            cursor: pointer;
                            transition: 0.2s;
                        ">&times;</button>
                    </div>
                </div>

                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleUp {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                </style>
            `;
            document.body.appendChild(popup);

            // Close button
            document.getElementById("closePopup").addEventListener("click", function() {
                document.getElementById("applyOverlay").remove();
            });
        }
    }
});