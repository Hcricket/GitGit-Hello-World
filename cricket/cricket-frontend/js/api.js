// API configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000
};

// API service
const ApiService = {
    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    // Auth endpoints
    auth: {
        async login(email, password) {
            return ApiService.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        },

        async register(name, email, password) {
            return ApiService.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
        },

        async getCurrentUser() {
            return ApiService.request('/auth/me');
        }
    },

    // Rooms endpoints
    rooms: {
        async getAll() {
            return ApiService.request('/rooms');
        },

        async getById(id) {
            return ApiService.request(`/rooms/${id}`);
        },

        async getLessons(roomId) {
            return ApiService.request(`/rooms/${roomId}/lessons`);
        }
    },

    // Lessons endpoints
    lessons: {
        async getById(id) {
            return ApiService.request(`/lessons/${id}`);
        },

        async completeLesson(id) {
            return ApiService.request(`/lessons/${id}/complete`, {
                method: 'POST'
            });
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}