/**
 * Component Manager - Handles dynamic loading of header and footer components
 * @class ComponentManager
 */
class ComponentManager {
    constructor() {
        this.basePath = this.getBasePath();
        this.init();
    }

    async init() {
        console.log('🚀 ComponentManager initialized');
        await this.loadComponents();
    }

    /**
     * Calculate base path based on current page location
     * @returns {string} Base path for component loading
     */
    getBasePath() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        console.log('📍 Path Analysis:', {
            fullPath: path,
            segments: segments,
            currentFile: segments[segments.length - 1] || 'index.html'
        });

        // Handle different directory levels
        if (path.includes('/pages/courses/')) {
            return '../../'; // From /pages/courses/ to root
        } else if (path.includes('/pages/')) {
            return '../'; // From /pages/ to root
        }
        
        return './'; // Root level
    }

    /**
     * Load header and footer components
     */
    async loadComponents() {
        try {
            console.log('📥 Loading components from:', this.basePath);

            // Load components in parallel for better performance
            const [headerHTML, footerHTML] = await Promise.all([
                this.loadComponent('header'),
                this.loadComponent('footer')
            ]);

            this.renderComponents(headerHTML, footerHTML);
            
        } catch (error) {
            console.error('❌ Error loading components:', error);
            this.showErrorState();
        }
    }

    /**
     * Load individual component
     * @param {string} componentName - Name of the component
     * @returns {Promise<string>} Component HTML
     */
    async loadComponent(componentName) {
        const response = await fetch(`${this.basePath}components/${componentName}.html`);
        
        if (!response.ok) {
            throw new Error(`${componentName} not found: ${response.status}`);
        }
        
        return await response.text();
    }

    /**
     * Render components to the DOM
     * @param {string} headerHTML - Header component HTML
     * @param {string} footerHTML - Footer component HTML
     */
    renderComponents(headerHTML, footerHTML) {
        // Render header
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
            console.log('✅ Header loaded successfully');
            this.fixComponentLinks(headerContainer, 'header');
            this.initializeNavigation();
        } else {
            console.warn('⚠️ Header container not found');
        }

        // Render footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
            console.log('✅ Footer loaded successfully');
            this.fixComponentLinks(footerContainer, 'footer');
        } else {
            console.warn('⚠️ Footer container not found');
        }
    }

    /**
     * Fix relative links in components based on current location
     * @param {HTMLElement} container - Component container element
     * @param {string} componentType - Type of component ('header' or 'footer')
     */
    fixComponentLinks(container, componentType) {
        const elements = container.querySelectorAll('a, img, link, script');
        
        elements.forEach(element => {
            const attribute = element.tagName === 'A' ? 'href' : 
                            element.tagName === 'IMG' ? 'src' : 
                            element.tagName === 'LINK' ? 'href' : 'src';
            
            const currentValue = element.getAttribute(attribute);
            
            if (currentValue && !this.isAbsolutePath(currentValue)) {
                const fixedPath = this.fixRelativePath(currentValue);
                element.setAttribute(attribute, fixedPath);
                
                console.log(`🔗 Fixed ${componentType} ${attribute}:`, {
                    from: currentValue,
                    to: fixedPath
                });
            }
        });
    }

    /**
     * Check if path is absolute
     * @param {string} path - Path to check
     * @returns {boolean} True if absolute path
     */
    isAbsolutePath(path) {
        return path.startsWith('http') || 
               path.startsWith('//') || 
               path.startsWith('#') || 
               path.startsWith('mailto:') || 
               path.startsWith('tel:');
    }

    /**
     * Fix relative path based on current base path
     * @param {string} path - Original relative path
     * @returns {string} Fixed path
     */
    fixRelativePath(path) {
        // Don't modify paths that are already correctly relative
        if (path.startsWith('../') || path.startsWith('./')) {
            return path;
        }
        
        // For root-level paths, prepend base path
        return this.basePath + path;
    }

    /**
     * Show error state when components fail to load
     */
    showErrorState() {
        const errorHTML = `
            <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 10px; border-radius: 4px;">
                <p style="margin: 0; color: #e65100; font-family: Arial, sans-serif;">
                    <strong>⚠️ Temporary Navigation Issue</strong><br>
                    <small>Please refresh the page or try again later.</small>
                </p>
            </div>
        `;

        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        
        if (headerContainer) headerContainer.innerHTML = errorHTML;
        if (footerContainer) footerContainer.innerHTML = errorHTML;
    }

    /**
     * Initialize navigation functionality
     */
    initializeNavigation() {
        this.setupMobileMenu();
        this.setupDropdowns();
        this.setupEventListeners();
        this.setupDarkMode();
    }

    /**
     * Setup dark mode toggle
     */
    setupDarkMode() {
        // Dark mode will be initialized by dark-mode.js
        console.log('🌓 Dark mode ready');
    }

    /**
     * Setup mobile menu toggle
     */
    setupMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu(mobileMenu, navLinks);
            });
        }
    }

    /**
     * Toggle mobile menu state
     * @param {HTMLElement} mobileMenu - Mobile menu button
     * @param {HTMLElement} navLinks - Navigation links container
     */
    toggleMobileMenu(mobileMenu, navLinks) {
        const isActive = navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        
        if (icon) {
            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-times', isActive);
        }
    }

    /**
     * Setup dropdown functionality
     */
    setupDropdowns() {
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                this.handleMobileDropdowns(e);
            }
        });
    }

    /**
     * Handle dropdown interactions on mobile
     * @param {Event} e - Click event
     */
    handleMobileDropdowns(e) {
        // Dropdown toggle
        if (e.target.closest('.dropdown > a')) {
            e.preventDefault();
            const dropdown = e.target.closest('.dropdown');
            this.toggleDropdown(dropdown, '.dropdown');
        }

        // Nested dropdown toggle
        if (e.target.closest('.nested-dropdown > a')) {
            e.preventDefault();
            const nestedDropdown = e.target.closest('.nested-dropdown');
            this.toggleDropdown(nestedDropdown, '.nested-dropdown');
        }
    }

    /**
     * Toggle dropdown and close others
     * @param {HTMLElement} currentDropdown - Dropdown to toggle
     * @param {string} selector - Selector for other dropdowns of same type
     */
    toggleDropdown(currentDropdown, selector) {
        // Close other dropdowns of the same type
        document.querySelectorAll(selector).forEach(other => {
            if (other !== currentDropdown) {
                other.classList.remove('active');
            }
        });

        // Toggle current dropdown
        currentDropdown.classList.toggle('active');
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Close menu when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !e.target.closest('.navbar')) {
                this.closeAllMenus();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeAllMenus();
            }
        });

        // Close menus on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }
        });
    }

    /**
     * Close all mobile menus and dropdowns
     */
    closeAllMenus() {
        // Close mobile menu
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (navLinks) navLinks.classList.remove('active');
        
        // Reset mobile menu icon
        if (mobileMenu) {
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        
        // Close all dropdowns
        const dropdownSelectors = ['.dropdown', '.nested-dropdown'];
        dropdownSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.remove('active');
            });
        });
    }
}

// === Global Loading Screen ===
document.addEventListener("DOMContentLoaded", () => {
    // Use absolute path from root
    const imagePath = '/images/SOS Logo.png';

    // Create Loader Element
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div style="text-align:center">
            <img src="${imagePath}" alt="SOSTTI Logo" id="loader-logo">
            <p style="margin-top: 20px; color: #333; font-family: Arial, sans-serif;">
                Loading<span class="loading-dots"></span>
            </p>
        </div>
    `;
    document.body.appendChild(loader);

    // Add Loader CSS
    const style = document.createElement('style');
    style.textContent = `
        #loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            backdrop-filter: blur(3px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.6s ease, visibility 0.6s ease;
        }

        #loader-logo {
            animation: pulse 1.5s infinite ease-in-out;
        }

        .loading-dots::after {
            content: '';
            animation: dots 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
        }

        #loader.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Hide Loader When Page Fully Loaded
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.classList.add("hidden");
            console.log('✅ Loader hidden - typing effect should start soon');
            
            // Force start typing effect if it hasn't started
            setTimeout(() => {
                if (window.typingInstance && !window.typingInstance.isRunning) {
                    window.typingInstance.start();
                }
            }, 1000);
        }, 1500);
    });

    // Store typing instance globally for debugging
    window.typingInstance = null;
    setTimeout(() => {
        if (window.TypingEffect) {
            window.typingInstance = new TypingEffect();
        }
    }, 2000);
});

// Initialize ComponentManager when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComponentManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentManager;
}