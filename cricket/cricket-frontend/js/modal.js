// Modal management
const ModalManager = {
    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            this.setupModalClose(modalId);
        }
    },

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Setup modal close functionality
    setupModalClose(modalId) {
        const modal = document.getElementById(modalId);
        const closeBtn = modal.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal(modalId);
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modalId);
            }
        });
    },

    // Initialize all modals
    init() {
        this.setupAuthModals();
    },

    // Setup auth modals
    setupAuthModals() {
        // Login modal
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.openModal('loginModal');
            });
        }

        // Register modal
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                this.openModal('registerModal');
            });
        }

        // Setup auth forms
        this.setupAuthForms();
    },

    // Setup auth forms
    setupAuthForms() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }

        // Switch between login and register
        this.setupAuthSwitching();
    },

    // Handle login
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await AuthManager.login(email, password);
            this.closeModal('loginModal');
        } catch (error) {
            // Error is handled in AuthManager
        }
    },

    // Handle register
    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            Utils.showNotification('Passwords do not match', 'error');
            return;
        }

        try {
            await AuthManager.register(name, email, password);
            this.closeModal('registerModal');
        } catch (error) {
            // Error is handled in AuthManager
        }
    },

    // Setup switching between login and register
    setupAuthSwitching() {
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');

        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('loginModal');
                this.openModal('registerModal');
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal('registerModal');
                this.openModal('loginModal');
            });
        }
    }
};

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ModalManager.init();
});