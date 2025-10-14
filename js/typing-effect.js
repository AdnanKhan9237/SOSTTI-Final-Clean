// Fixed Typing Effect - Clears existing content
class TypingEffect {
    constructor() {
        this.typingElement = null;
        this.texts = [
            "NAVTTC Accredited Institute",
            "Empowering Youth Through Technical, Computer and English Skills",
            "Building the Next Generation of Technical and IT Experts", 
            "Hands-On Practical Learning",
            "Industry-Ready Skills Training",
            "Your Pathway to a Bright Future"
        ];
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isRunning = false;
        this.init();
    }

    init() {
        console.log('⌨️ TypingEffect initialized');
        this.waitForLoader();
    }

    waitForLoader() {
        const checkLoader = setInterval(() => {
            const loader = document.getElementById('loader');
            
            if (!loader || loader.classList.contains('hidden')) {
                clearInterval(checkLoader);
                setTimeout(() => this.start(), 300);
            }
        }, 100);
    }

    start() {
        this.typingElement = document.getElementById('typing-text');
        
        if (!this.typingElement) {
            console.error('❌ Typing element (#typing-text) not found');
            return;
        }

        // ✅ CRITICAL FIX: Clear existing content
        this.typingElement.innerHTML = '';
        this.typingElement.style.minHeight = '60px'; // Ensure consistent height
        
        console.log('🎬 Starting typing effect on clean element');
        this.isRunning = true;
        this.type();
    }

    type() {
        if (!this.isRunning) return;

        const currentText = this.texts[this.textIndex];
        
        // Update text content
        this.typingElement.textContent = currentText.substring(0, this.charIndex);
        this.typingElement.classList.add('typing-cursor');

        if (!this.isDeleting) {
            // Typing forward
            if (this.charIndex < currentText.length) {
                this.charIndex++;
                setTimeout(() => this.type(), 100);
            } else {
                // Finished typing, wait then start deleting
                this.isDeleting = true;
                setTimeout(() => this.type(), 2000);
            }
        } else {
            // Deleting backward
            if (this.charIndex > 0) {
                this.charIndex--;
                setTimeout(() => this.type(), 50);
            } else {
                // Finished deleting, move to next text
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
            }
        }
    }

    stop() {
        this.isRunning = false;
        if (this.typingElement) {
            this.typingElement.classList.remove('typing-cursor');
        }
    }
}

// Add CSS for typing effect
function addTypingStyles() {
    if (document.getElementById('typing-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'typing-styles';
    style.textContent = `
        .typing-cursor {
            border-right: 2px solid #333;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { border-color: #333; }
            50% { border-color: transparent; }
        }
        
        #typing-text {
            min-height: 60px;
            display: block;
            font-size: 1.2em;
            font-weight: bold;
            text-align: center;
            margin: 20px auto;
        }
    `;
    document.head.appendChild(style);
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', function() {
    addTypingStyles();
    
    // Wait a bit longer to ensure DOM is fully ready
    setTimeout(() => {
        new TypingEffect();
    }, 500);
});