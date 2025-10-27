// Sidebar Dark Mode Toggle
class DarkModeSidebar {
    constructor() {
        this.isDarkMode = false;
        this.sidebar = null;
        this.toggleBtn = null;
        this.init();
    }

    init() {
        this.loadPreference();
        this.createSidebar();
        this.applyMode();
        
        console.log('🌓 Sidebar Dark Mode initialized');
    }

    loadPreference() {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            this.isDarkMode = JSON.parse(savedMode);
        } else {
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    savePreference() {
        localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    }

    createSidebar() {
        // Create sidebar container
        this.sidebar = document.createElement('div');
        this.sidebar.className = 'dark-mode-sidebar';
        this.sidebar.innerHTML = `
            <div class="sidebar-content">
                <div class="sidebar-header">
                    <h3>Theme Settings</h3>
                    <button class="close-sidebar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="theme-options">
                    <div class="theme-option ${!this.isDarkMode ? 'active' : ''}" data-theme="light">
                        <div class="theme-preview light-theme">
                            <div class="preview-header"></div>
                            <div class="preview-content">
                                <div class="preview-card"></div>
                                <div class="preview-card"></div>
                            </div>
                        </div>
                        <span>Light Mode</span>
                        <i class="fas fa-check"></i>
                    </div>
                    
                    <div class="theme-option ${this.isDarkMode ? 'active' : ''}" data-theme="dark">
                        <div class="theme-preview dark-theme">
                            <div class="preview-header"></div>
                            <div class="preview-content">
                                <div class="preview-card"></div>
                                <div class="preview-card"></div>
                            </div>
                        </div>
                        <span>Dark Mode</span>
                        <i class="fas fa-check"></i>
                    </div>
                </div>
                
                <div class="sidebar-footer">
                    <button class="theme-toggle-btn">
                        <i class="fas ${this.isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
                        ${this.isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                </div>
            </div>
        `;

        // Create toggle button
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'sidebar-toggle-btn';
        this.toggleBtn.setAttribute('aria-label', 'Theme Settings');
        this.toggleBtn.innerHTML = '<i class="fas fa-palette"></i>';

        // Add to body
        document.body.appendChild(this.sidebar);
        document.body.appendChild(this.toggleBtn);

        // Add event listeners
        this.addEventListeners();
        this.addStyles();
    }

    addEventListeners() {
        // Toggle sidebar
        this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Close sidebar
        const closeBtn = this.sidebar.querySelector('.close-sidebar');
        closeBtn.addEventListener('click', () => this.closeSidebar());
        
        // Theme option clicks
        const themeOptions = this.sidebar.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme === 'dark');
            });
        });
        
        // Toggle button in sidebar
        const toggleBtn = this.sidebar.querySelector('.theme-toggle-btn');
        toggleBtn.addEventListener('click', () => this.toggleMode());
        
        // Close on overlay click
        this.sidebar.addEventListener('click', (e) => {
            if (e.target === this.sidebar) {
                this.closeSidebar();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar.classList.contains('active')) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('active');
        document.body.style.overflow = this.sidebar.classList.contains('active') ? 'hidden' : '';
    }

    closeSidebar() {
        this.sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }

    setTheme(isDark) {
        this.isDarkMode = isDark;
        this.applyMode();
        this.savePreference();
        this.updateUI();
    }

    toggleMode() {
        this.isDarkMode = !this.isDarkMode;
        this.applyMode();
        this.savePreference();
        this.updateUI();
    }

    applyMode() {
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    updateUI() {
        // Update theme options
        const themeOptions = this.sidebar.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === (this.isDarkMode ? 'dark' : 'light')) {
                option.classList.add('active');
            }
        });
        
        // Update toggle button
        const toggleBtn = this.sidebar.querySelector('.theme-toggle-btn');
        toggleBtn.innerHTML = `
            <i class="fas ${this.isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
            ${this.isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Sidebar Toggle Button */
            .sidebar-toggle-btn {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                background: linear-gradient(135deg, #016390, #00aaff);
                color: white;
                border: none;
                border-radius: 8px 0 0 8px;
                padding: 15px 12px;
                cursor: pointer;
                z-index: 9998;
                box-shadow: -2px 0 15px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                font-size: 1.2rem;
            }

            .sidebar-toggle-btn:hover {
                padding-right: 18px;
                background: linear-gradient(135deg, #00aaff, #016390);
            }

            /* Sidebar */
            .dark-mode-sidebar {
                position: fixed;
                top: 0;
                right: -400px;
                width: 350px;
                height: 100vh;
                background: white;
                box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                transition: right 0.3s ease;
                overflow-y: auto;
            }

            .dark-mode-sidebar.active {
                right: 0;
            }

            .dark-mode-sidebar::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: -1;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            .dark-mode-sidebar.active::before {
                opacity: 1;
                pointer-events: all;
            }

            /* Sidebar Content */
            .sidebar-content {
                padding: 30px;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .sidebar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }

            .sidebar-header h3 {
                color: #333;
                margin: 0;
                font-size: 1.4rem;
            }

            .close-sidebar {
                background: none;
                border: none;
                font-size: 1.3rem;
                color: #666;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .close-sidebar:hover {
                background: #f0f0f0;
                color: #333;
            }

            /* Theme Options */
            .theme-options {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .theme-option {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .theme-option:hover {
                border-color: #016390;
                transform: translateY(-2px);
            }

            .theme-option.active {
                border-color: #016390;
                background: rgba(1, 99, 144, 0.05);
            }

            .theme-option.active .fa-check {
                opacity: 1;
            }

            .theme-preview {
                width: 60px;
                height: 40px;
                border-radius: 6px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .light-theme {
                background: #ffffff;
                border: 1px solid #e0e0e0;
            }

            .light-theme .preview-header {
                height: 8px;
                background: #016390;
            }

            .light-theme .preview-content {
                padding: 4px;
            }

            .light-theme .preview-card {
                height: 4px;
                background: #f0f0f0;
                margin-bottom: 2px;
                border-radius: 2px;
            }

            .dark-theme {
                background: #1a1a1a;
                border: 1px solid #333;
            }

            .dark-theme .preview-header {
                height: 8px;
                background: #00aaff;
            }

            .dark-theme .preview-content {
                padding: 4px;
            }

            .dark-theme .preview-card {
                height: 4px;
                background: #2d2d2d;
                margin-bottom: 2px;
                border-radius: 2px;
            }

            .theme-option span {
                font-weight: 600;
                color: #333;
            }

            .theme-option .fa-check {
                margin-left: auto;
                color: #016390;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            /* Sidebar Footer */
            .sidebar-footer {
                margin-top: auto;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
            }

            .theme-toggle-btn {
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #016390, #00aaff);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .theme-toggle-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(1, 99, 144, 0.3);
            }

            /* Theme Variables (light + dark) */
            :root {
                /* Surfaces */
                --bg-primary: #ffffff;
                --bg-secondary: #f6f8fb;
                --surface: #ffffff;
                /* Text */
                --text-primary: #0f2d3a;
                --text-secondary: #4a6675;
                /* Brand */
                --primary: #016390;
                --primary-dark: #004e72;
                --accent: #00aaff;
                /* Misc */
                --border-color: #e6eef3;
                --light: #eef5f8;
                --white: #ffffff;
                --accent-color: var(--accent);
            }

            [data-theme="dark"] {
                /* Surfaces */
                --bg-primary: #0e141a;
                --bg-secondary: #121a23;
                --surface: #0f1a23;
                /* Text */
                --text-primary: #e6f1f7;
                --text-secondary: #a5bbc7;
                /* Brand */
                --primary: #0ea5c6;
                --primary-dark: #0891b2;
                --accent: #38bdf8;
                /* Misc */
                --border-color: #26333d;
                --light: #15212b;
                --white: #0f1a23;
                --accent-color: var(--accent);
            }

            /* Smooth transitions */
            html, body, header, .program-card, .dropdown-content, .resource-card, .meta-card, footer {
                transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
            }

            /* Dark Mode Styles */
            [data-theme="dark"] body {
                background-color: var(--bg-primary);
                color: var(--text-primary);
            }

            [data-theme="dark"] header {
                background-color: var(--bg-secondary);
                border-bottom: 1px solid var(--border-color);
                box-shadow: 0 2px 10px rgba(0,0,0,0.25);
            }

            [data-theme="dark"] .navbar {
                background-color: var(--bg-secondary);
            }

            [data-theme="dark"] .nav-links a {
                color: var(--text-primary);
            }

            [data-theme="dark"] .hero {
                background: linear-gradient(135deg, var(--primary-dark), #0d2d42);
            }

            [data-theme="dark"] .programs {
                background-color: var(--bg-secondary);
            }

            [data-theme="dark"] .program-card,
            [data-theme="dark"] .resource-card,
            [data-theme="dark"] .meta-card {
                background-color: var(--surface);
                border: 1px solid var(--border-color);
                box-shadow: 0 10px 24px rgba(0,0,0,0.25);
            }

            [data-theme="dark"] .program-card h3,
            [data-theme="dark"] .program-card p {
                color: var(--text-primary);
            }

            [data-theme="dark"] .about {
                background-color: var(--bg-primary);
            }

            [data-theme="dark"] .about-text h2,
            [data-theme="dark"] .about-text p {
                color: var(--text-primary);
            }

            [data-theme="dark"] .stats {
                background: linear-gradient(135deg, #0d2d42, #016390);
            }

            [data-theme="dark"] .partners {
                background-color: var(--bg-secondary);
            }

            [data-theme="dark"] .section-title h2 {
                color: var(--text-primary);
            }

            [data-theme="dark"] .section-title p {
                color: var(--text-secondary);
            }

            [data-theme="dark"] .dropdown-content {
                background-color: var(--bg-secondary);
                border: 1px solid var(--border-color);
                box-shadow: 0 12px 28px rgba(0,0,0,0.35);
            }

            [data-theme="dark"] .dropdown-content a {
                color: var(--text-primary);
            }

            [data-theme="dark"] .dropdown-content a:hover {
                background-color: var(--bg-primary);
            }

            [data-theme="dark"] .video-promo {
                background-color: var(--bg-secondary);
            }

            [data-theme="dark"] .video-content h2 {
                color: var(--text-primary);
            }

            [data-theme="dark"] .video-content p {
                color: var(--text-secondary);
            }

            [data-theme="dark"] footer {
                background-color: var(--bg-secondary);
            }

            [data-theme="dark"] .footer-column h3 {
                color: var(--text-primary);
            }

            [data-theme="dark"] .contact-item {
                color: var(--text-primary);
            }

            [data-theme="dark"] .testimonials {
                background-color: var(--bg-primary);
            }

            [data-theme="dark"] .carousel-item p {
                color: var(--text-primary);
            }

            [data-theme="dark"] .btn-details-outline {
                border-color: var(--accent);
                color: var(--accent);
            }

            [data-theme="dark"] .btn-details-outline:hover {
                background-color: var(--accent);
                color: white;
            }

            /* Dark sidebar styles */
            [data-theme="dark"] .dark-mode-sidebar {
                background: var(--bg-secondary);
                box-shadow: -5px 0 25px rgba(0,0,0,0.35);
            }

            [data-theme="dark"] .sidebar-header h3 {
                color: var(--text-primary);
            }

            [data-theme="dark"] .theme-option span {
                color: var(--text-primary);
            }

            [data-theme="dark"] .theme-option {
                border-color: var(--border-color);
                background: var(--bg-primary);
            }

            [data-theme="dark"] .sidebar-header {
                border-bottom-color: var(--border-color);
            }

            [data-theme="dark"] .sidebar-footer {
                border-top-color: var(--border-color);
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .dark-mode-sidebar {
                    width: 300px;
                }
                
                .sidebar-content {
                    padding: 20px;
                }
            }

            @media (max-width: 480px) {
                .dark-mode-sidebar {
                    width: 100%;
                    right: -100%;
                }
                
                .sidebar-toggle-btn {
                    padding: 12px 8px;
                    font-size: 1.1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DarkModeSidebar();
});