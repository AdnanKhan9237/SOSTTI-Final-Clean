// Initialize Back to Top and WhatsApp buttons
function initializeFloatingButtons() {
    // Create and add Back to Top button
    const backToTopHTML = `
        <button id="backToTop" class="back-to-top" aria-label="Back to Top">
            <i class="fas fa-chevron-up"></i>
        </button>
    `;
    
    // Create and add WhatsApp button
    const whatsappButtonHTML = `
        <a href="https://wa.me/923332247494?text=Hello%20SOSTTI%2C%20I%20would%20like%20to%20get%20more%20information%20about%20your%20courses" 
           target="_blank" rel="noopener"
           id="whatsappButton" 
           class="whatsapp-button" 
           aria-label="Contact us on WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
    `;
    
    // Add buttons to page
    document.body.insertAdjacentHTML('beforeend', backToTopHTML);
    document.body.insertAdjacentHTML('beforeend', whatsappButtonHTML);
    
    // Back to Top functionality
    const backToTopBtn = document.getElementById('backToTop');
    
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleBackToTop();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFloatingButtons);