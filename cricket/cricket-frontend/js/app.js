// Main application initialization
const App = {
    // Initialize the application
    init() {
        console.log('🚀 Cricket English Learning Platform initialized');
        
        // Initialize all modules
        this.initModules();
        
        // Setup global event listeners
        this.setupGlobalEvents();
        
        // Check for welcome message
        this.showWelcomeMessage();
    },

    // Initialize all modules
    initModules() {
        // Modules are initialized in their own files
        // This is a placeholder for any additional app-level initialization
    },

    // Setup global event listeners
    setupGlobalEvents() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu);
        }

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Page became visible, refresh data if needed
                this.handlePageVisible();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            Utils.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showNotification('You are offline', 'error');
        });
    },

    // Toggle mobile menu
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const userActions = document.querySelector('.user-actions');
        
        navMenu.classList.toggle('active');
        userActions.classList.toggle('active');
        
        // Add mobile menu styles if not already added
        if (!document.querySelector('#mobile-menu-styles')) {
            const styles = document.createElement('style');
            styles.id = 'mobile-menu-styles';
            styles.textContent = `
                @media (max-width: 768px) {
                    .nav-menu.active,
                    .user-actions.active {
                        display: flex !important;
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: white;
                        box-shadow: var(--shadow-lg);
                        padding: 1rem;
                        gap: 1rem;
                    }
                    
                    .nav-menu.active ul {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    .user-actions.active {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    },

    // Handle page becoming visible
    handlePageVisible() {
        // Refresh rooms data if it's stale
        const lastUpdate = localStorage.getItem('roomsLastUpdate');
        const now = Date.now();
        
        if (!lastUpdate || (now - parseInt(lastUpdate)) > 5 * 60 * 1000) { // 5 minutes
            RoomsManager.loadRooms();
        }
    },

    // Show welcome message for first-time visitors
    showWelcomeMessage() {
        const hasVisited = localStorage.getItem('hasVisited');
        
        if (!hasVisited) {
            setTimeout(() => {
                Utils.showNotification('Welcome to Cricket! Start your English learning journey today.', 'info');
                localStorage.setItem('hasVisited', 'true');
            }, 2000);
        }
    },

    // Utility method to check if user is on mobile
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Utility method to get screen size category
    getScreenSize() {
        const width = window.innerWidth;
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        return 'xl';
    }
};

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}