// Rooms management
const RoomsManager = {
    rooms: [],
    currentRoom: null,

    // Initialize rooms
    async init() {
        await this.loadRooms();
        this.setupEventListeners();
    },

    // Load rooms from API
    async loadRooms() {
        try {
            const roomsGrid = document.getElementById('roomsGrid');
            roomsGrid.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading rooms...</p>
                </div>
            `;

            const response = await ApiService.rooms.getAll();
            
            if (response.success) {
                this.rooms = response.data;
                this.renderRooms();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            document.getElementById('roomsGrid').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    Failed to load rooms. Please try again later.
                </div>
            `;
        }
    },

    // Render rooms to the grid
    renderRooms() {
        const roomsGrid = document.getElementById('roomsGrid');
        
        if (this.rooms.length === 0) {
            roomsGrid.innerHTML = `
                <div class="text-center">
                    <p>No rooms available at the moment.</p>
                </div>
            `;
            return;
        }

        roomsGrid.innerHTML = this.rooms.map(room => this.createRoomCard(room)).join('');
        
        // Add click event listeners to room cards
        roomsGrid.querySelectorAll('.room-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.openRoomModal(this.rooms[index]);
            });
        });
    },

    // Create room card HTML
    createRoomCard(room) {
        const roomClass = Utils.getRoomClassName(room.name);
        const progress = AuthManager.getRoomProgress(room._id);
        
        return `
            <div class="room-card room-${roomClass}" data-room-id="${room._id}">
                <div class="room-header">
                    <i class="fas ${room.icon || 'fa-book'} room-icon"></i>
                    ${room.name}
                </div>
                <div class="room-content">
                    <h3 class="room-title">${room.name}</h3>
                    <p class="room-description">${room.description}</p>
                    
                    <div class="room-topics">
                        ${room.topics.slice(0, 4).map(topic => 
                            `<span class="topic-tag">${topic}</span>`
                        ).join('')}
                        ${room.topics.length > 4 ? 
                            `<span class="topic-tag">+${room.topics.length - 4} more</span>` : ''
                        }
                    </div>
                    
                    <div class="room-meta">
                        <span class="room-difficulty">
                            <span class="difficulty-badge difficulty-${room.difficulty}">
                                ${room.difficulty}
                            </span>
                        </span>
                        <span class="room-duration">
                            <i class="far fa-clock"></i>
                            ${Utils.formatDuration(room.estimatedHours * 60)}
                        </span>
                    </div>
                    
                    ${progress > 0 ? `
                        <div class="room-progress">
                            <div class="progress-header">
                                <span class="progress-text">Progress</span>
                                <span class="progress-percentage">${progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Open room modal
    async openRoomModal(room) {
        try {
            const modal = document.getElementById('roomModal');
            const modalContent = modal.querySelector('.modal-content');
            
            // Show loading state
            modalContent.innerHTML = `
                <div class="modal-header room-modal-header" style="background-color: ${room.color}">
                    <h2 class="modal-title">${room.name}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading lessons...</p>
                    </div>
                </div>
            `;

            modal.style.display = 'block';

            // Load room lessons
            const response = await ApiService.rooms.getLessons(room._id);
            
            if (response.success) {
                this.currentRoom = response.data.room;
                this.renderRoomModal(response.data.room, response.data.lessons);
            } else {
                throw new Error(response.message);
            }

            // Setup modal close
            this.setupModalClose(modal);
        } catch (error) {
            console.error('Error opening room modal:', error);
            Utils.showNotification('Failed to load room details', 'error');
            this.closeModal('roomModal');
        }
    },

    // Render room modal content
    renderRoomModal(room, lessons) {
        const modalContent = document.getElementById('roomModal').querySelector('.modal-content');
        const roomClass = Utils.getRoomClassName(room.name);
        
        modalContent.innerHTML = `
            <div class="modal-header room-modal-header room-${roomClass}">
                <div>
                    <h2 class="room-modal-title">${room.name}</h2>
                    <p class="room-modal-description">${room.description}</p>
                </div>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="room-details">
                    <div class="room-meta-large">
                        <span class="difficulty-badge difficulty-${room.difficulty}">
                            ${room.difficulty}
                        </span>
                        <span class="room-duration">
                            <i class="far fa-clock"></i>
                            ${Utils.formatDuration(room.estimatedHours * 60)}
                        </span>
                        <span class="lessons-count">
                            <i class="fas fa-book"></i>
                            ${lessons.length} lessons
                        </span>
                    </div>
                    
                    <div class="room-topics-large">
                        <h4>Topics Covered:</h4>
                        <div class="topics-list">
                            ${room.topics.map(topic => 
                                `<span class="topic-tag-large">${topic}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="lessons-section">
                    <h3>Available Lessons</h3>
                    ${lessons.length > 0 ? 
                        this.renderLessonsGrid(lessons) : 
                        '<p class="text-center">No lessons available yet.</p>'
                    }
                </div>
            </div>
        `;

        // Setup lesson buttons
        this.setupLessonButtons(lessons);
    },

    // Render lessons grid
    renderLessonsGrid(lessons) {
        return `
            <div class="lessons-grid">
                ${lessons.map(lesson => this.createLessonCard(lesson)).join('')}
            </div>
        `;
    },

    // Create lesson card
    createLessonCard(lesson) {
        const isCompleted = AuthManager.currentUser && 
            AuthManager.currentUser.progress?.some(p => 
                p.roomId === this.currentRoom._id && 
                p.completedLessons?.includes(lesson._id)
            );

        return `
            <div class="lesson-card" data-lesson-id="${lesson._id}">
                <div class="lesson-image" style="background-image: url('${lesson.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}')">
                    <span class="lesson-duration">${Utils.formatDuration(lesson.duration)}</span>
                    ${isCompleted ? '<span class="completed-badge">Completed</span>' : ''}
                </div>
                <div class="lesson-content">
                    <h4 class="lesson-title">${lesson.title}</h4>
                    <p class="lesson-description">${lesson.description}</p>
                    <div class="lesson-meta">
                        <span class="lesson-level">
                            <i class="fas fa-signal"></i>
                            ${Utils.capitalize(lesson.level)}
                        </span>
                    </div>
                    <div class="lesson-actions">
                        <button class="btn-start-lesson" data-lesson-id="${lesson._id}">
                            ${isCompleted ? 'Review Lesson' : 'Start Lesson'}
                        </button>
                        <button class="btn-preview">Preview</button>
                    </div>
                </div>
            </div>
        `;
    },

    // Setup lesson buttons
    setupLessonButtons(lessons) {
        document.querySelectorAll('.btn-start-lesson').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const lessonId = button.dataset.lessonId;
                this.startLesson(lessonId);
            });
        });

        document.querySelectorAll('.btn-preview').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const lessonCard = button.closest('.lesson-card');
                const lessonId = lessonCard.dataset.lessonId;
                this.previewLesson(lessonId);
            });
        });
    },

    // Start lesson
    async startLesson(lessonId) {
        if (!AuthManager.isLoggedIn()) {
            Utils.showNotification('Please login to start lessons', 'error');
            ModalManager.openModal('loginModal');
            return;
        }

        try {
            // In a real app, this would redirect to the lesson page
            Utils.showNotification('Starting lesson...', 'info');
            
            // Mark lesson as completed (for demo)
            await ApiService.lessons.completeLesson(lessonId);
            
            // Reload user data to update progress
            const userResponse = await ApiService.auth.getCurrentUser();
            AuthManager.saveUser(userResponse.data);
            
            // Update the modal
            this.openRoomModal(this.currentRoom);
            
        } catch (error) {
            Utils.showNotification('Failed to start lesson', 'error');
        }
    },

    // Preview lesson
    previewLesson(lessonId) {
        Utils.showNotification('Lesson preview feature coming soon!', 'info');
    },

    // Setup modal close
    setupModalClose(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            this.closeModal('roomModal');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal('roomModal');
            }
        });
    },

    // Close modal
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        if (searchInput && searchBtn) {
            const performSearch = Utils.debounce(() => {
                this.searchRooms(searchInput.value);
            }, 300);

            searchInput.addEventListener('input', performSearch);
            searchBtn.addEventListener('click', () => {
                this.searchRooms(searchInput.value);
            });
        }
    },

    // Search rooms
    searchRooms(query) {
        if (!query.trim()) {
            this.renderRooms();
            return;
        }

        const filteredRooms = this.rooms.filter(room =>
            room.name.toLowerCase().includes(query.toLowerCase()) ||
            room.description.toLowerCase().includes(query.toLowerCase()) ||
            room.topics.some(topic => topic.toLowerCase().includes(query.toLowerCase()))
        );

        const roomsGrid = document.getElementById('roomsGrid');
        roomsGrid.innerHTML = filteredRooms.length > 0 ?
            filteredRooms.map(room => this.createRoomCard(room)).join('') :
            '<div class="text-center"><p>No rooms found matching your search.</p></div>';

        // Re-attach event listeners
        roomsGrid.querySelectorAll('.room-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.openRoomModal(filteredRooms[index]);
            });
        });
    }
};

// Initialize rooms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    RoomsManager.init();
});