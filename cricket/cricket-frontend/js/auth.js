// Authentication management
const AuthManager = {
    currentUser: null,

    // Initialize auth state
    init() {
        this.loadUserFromStorage();
        this.updateUI();
        this.setupEventListeners();
    },

    // Load user from localStorage
    loadUserFromStorage() {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    },

    // Save user to localStorage
    saveUser(userData) {
        this.currentUser = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        this.updateUI();
    },

    // Login user
    async login(email, password) {
        try {
            const response = await ApiService.auth.login(email, password);
            
            if (response.success) {
                this.saveUser(response.data);
                Utils.showNotification('Login successful!', 'success');
                return response;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            Utils.showNotification(error.message, 'error');
            throw error;
        }
    },

    // Register user
    async register(name, email, password) {
        try {
            const response = await ApiService.auth.register(name, email, password);
            
            if (response.success) {
                this.saveUser(response.data);
                Utils.showNotification('Registration successful!', 'success');
                return response;
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            Utils.showNotification(error.message, 'error');
            throw error;
        }
    },

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.updateUI();
        Utils.showNotification('Logged out successfully', 'info');
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    },

    // Get user progress for a room
    getRoomProgress(roomId) {
        if (!this.currentUser || !this.currentUser.progress) {
            return 0;
        }

        const roomProgress = this.currentUser.progress.find(
            p => p.roomId === roomId
        );

        return roomProgress ? roomProgress.progress : 0;
    },

    // Update UI based on auth state
    updateUI() {
        const userActions = document.getElementById('userActions');
        
        if (!userActions) return;

        if (this.isLoggedIn()) {
            userActions.innerHTML = `
                <div class="user-menu">
                    <div class="user-avatar">
                        ${this.currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-info">
                        <div class="user-name">${this.currentUser.name}</div>
                        <div class="user-email">${this.currentUser.email}</div>
                    </div>
                    <button class="logout-btn" id="logoutBtn" title="Logout">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;

            // Add logout event listener
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.logout();
            });
        } else {
            userActions.innerHTML = `
                <button class="btn btn-secondary" id="loginBtn">Sign In</button>
                <button class="btn btn-primary" id="registerBtn">Get Started</button>
            `;
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                try {
                    await this.login(email, password);
                    ModalManager.closeModal('loginModal');
                } catch (error) {
                    // Error handled in login method
                }
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('registerConfirmPassword').value;

                if (password !== confirmPassword) {
                    Utils.showNotification('Passwords do not match', 'error');
                    return;
                }

                try {
                    await this.register(name, email, password);
                    ModalManager.closeModal('registerModal');
                } catch (error) {
                    // Error handled in register method
                }
            });
        }
    }
};