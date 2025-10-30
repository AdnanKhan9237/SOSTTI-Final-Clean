// Clean Typing Effect - Fixed Jagged Animation
class TypingEffect {
    constructor() {
        this.typingElement = null;
        this.cursorElement = null;
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
        this.typeSpeed = 70;
        this.deleteSpeed = 35;
        this.pauseTime = 1200;
        this.init();
    }

    init() {
        // Create fresh elements to avoid conflicts
        this.createCleanElements();
        this.waitForLoader();
    }

    createCleanElements() {
        // Find the typing container
        const typingContainer = document.querySelector('.typing-container');
        if (!typingContainer) {
            return;
        }

        // Completely clear the container
        typingContainer.innerHTML = '';

        // Create fresh elements
        this.typingElement = document.createElement('span');
        this.typingElement.id = 'typing-text';
        this.typingElement.className = 'typing-text';
        
        this.cursorElement = document.createElement('span');
        this.cursorElement.className = 'typing-cursor';

        // Append fresh elements
        typingContainer.appendChild(this.typingElement);
        typingContainer.appendChild(this.cursorElement);
    }

    waitForLoader() {
        const checkLoader = setInterval(() => {
            const loader = document.getElementById('loader');
            
            if (!loader || loader.classList.contains('hidden')) {
                clearInterval(checkLoader);
                setTimeout(() => this.start(), 400);
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkLoader);
            if (!this.isRunning) {
                this.start();
            }
        }, 4000);
    }

    start() {
        if (!this.typingElement) {
            return;
        }
        
        // Ensure elements are visible and ready
        this.typingElement.style.visibility = 'visible';
        this.typingElement.style.opacity = '1';
        
        if (this.cursorElement) {
            this.cursorElement.style.display = 'inline-block';
            this.cursorElement.style.visibility = 'visible';
            this.cursorElement.style.opacity = '1';
        }

        this.isRunning = true;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        // Start with a slight delay to ensure rendering
        setTimeout(() => this.type(), 100);
    }

    type() {
        if (!this.isRunning || !this.typingElement) return;

        const currentText = this.texts[this.textIndex];
        
        // Use textContent for better performance
        this.typingElement.textContent = currentText.substring(0, this.charIndex);

        // Force reflow to ensure smooth animation
        this.typingElement.offsetHeight;

        if (!this.isDeleting) {
            // Typing forward - ensure we don't exceed length
            if (this.charIndex <= currentText.length) {
                this.charIndex++;
                setTimeout(() => this.type(), this.typeSpeed);
            } else {
                // Finished typing, wait then start deleting
                this.isDeleting = true;
                setTimeout(() => this.type(), this.pauseTime);
            }
        } else {
            // Deleting backward - ensure we don't go below 0
            if (this.charIndex > 0) {
                this.charIndex--;
                setTimeout(() => this.type(), this.deleteSpeed);
            } else {
                // Finished deleting, move to next text
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 400);
            }
        }
    }

    stop() {
        this.isRunning = false;
        if (this.cursorElement) {
            this.cursorElement.style.display = 'none';
        }
    }
}

// Add optimized CSS for smooth typing
function addTypingStyles() {
    if (document.getElementById('typing-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'typing-styles';
    style.textContent = `
        .typing-container {
            text-align: center;
            margin: 10px auto;
            display: block;
            min-height: 45px;
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;
            position: relative;
        }
        
        .typing-text {
            display: inline !important;
            font-size: 1.3em;
            font-weight: 500;
            white-space: nowrap;
            color: white !important;
            line-height: 1.2;
            min-height: 1.2em;
            font-family: 'Poppins', sans-serif;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            visibility: visible;
            opacity: 1;
            transition: opacity 0.2s ease;
            will-change: contents;
        }
        
        .typing-cursor {
            display: inline-block;
            width: 2px;
            height: 1.2em;
            background-color: white !important;
            margin-left: 2px;
            animation: smooth-blink 1.1s ease-in-out infinite;
            vertical-align: middle;
            visibility: visible !important;
            border-radius: 1px;
            opacity: 1;
            transition: opacity 0.2s ease;
            will-change: opacity;
        }
        
        @keyframes smooth-blink {
            0%, 100% { 
                opacity: 1;
                transform: scaleY(1);
            }
            45%, 55% { 
                opacity: 0;
                transform: scaleY(0.1);
            }
        }

        /* Ensure no conflicts with dark mode */
        .typing-text,
        [data-theme="dark"] .typing-text {
            color: white !important;
            background: transparent !important;
        }

        .typing-cursor,
        [data-theme="dark"] .typing-cursor {
            background-color: white !important;
        }

        /* Optimize for performance */
        .typing-container {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000;
        }

        /* Desktop sizes */
        @media (min-width: 1201px) {
            .typing-text {
                font-size: 1.4em;
            }
            .typing-container {
                min-height: 50px;
            }
            .typing-cursor {
                height: 1.4em;
            }
        }

        @media (min-width: 1025px) and (max-width: 1200px) {
            .typing-text {
                font-size: 1.3em;
            }
            .typing-cursor {
                height: 1.3em;
            }
        }

        /* Tablet sizes */
        @media (min-width: 769px) and (max-width: 1024px) {
            .typing-text {
                font-size: 1.2em;
                white-space: normal;
            }
            .typing-container {
                min-height: 60px;
            }
            .typing-cursor {
                height: 1.2em;
            }
        }

        /* Mobile sizes */
        @media (min-width: 481px) and (max-width: 768px) {
            .typing-text {
                font-size: 1.1em;
                white-space: normal;
                line-height: 1.1;
            }
            .typing-container {
                min-height: 55px;
                margin: 8px auto;
            }
            .typing-cursor {
                height: 1.1em;
            }
        }

        @media (max-width: 480px) {
            .typing-text {
                font-size: 1em;
                white-space: normal;
                line-height: 1.1;
            }
            .typing-container {
                min-height: 50px;
                margin: 5px auto;
                padding: 0 10px;
            }
            .typing-cursor {
                height: 1em;
            }
        }

        /* Multi-line handling */
        @media (max-width: 768px) {
            .typing-text {
                word-wrap: break-word;
                word-break: break-word;
                overflow-wrap: break-word;
            }
            
            .typing-container {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
            }
        }

        /* Smooth alignment */
        .typing-text, .typing-cursor {
            vertical-align: middle;
            transform: translateZ(0);
        }
    `;
    document.head.appendChild(style);
}

// Clean initialization
function initializeTypingEffect() {
    // Remove any existing instances
    if (window.typingInstance) {
        window.typingInstance.stop();
        window.typingInstance = null;
    }
    
    addTypingStyles();
    
    // Wait a bit longer for complete page load
    setTimeout(() => {
        window.typingInstance = new TypingEffect();
    }, 1500);
}

// Initialize with proper timing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeTypingEffect, 500);
    });
} else {
    setTimeout(initializeTypingEffect, 500);
}

// Global access for debugging
window.TypingEffect = TypingEffect;