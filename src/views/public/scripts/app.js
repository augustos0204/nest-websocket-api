// RoomStream Admin - Core Application
function roomStreamApp() {
    return {
        // UI State
        sidebarOpen: false,
        currentView: 'dashboard',
        darkMode: false,
        showConfigModal: false,
        showCreateRoomModal: false,
        chatOpen: false,
        chatExpanded: false,
        
        // Data
        rooms: [],
        selectedRoom: null,
        metrics: {
            totalRooms: 0,
            onlineUsers: 0,
            messagesPerMin: 0,
            uptime: '0s'
        },
        healthStatus: 'healthy',
        config: {
            baseUrl: 'http://localhost:3000',
            websocketNamespace: '/ws/rooms'
        },
        
        // Chat
        chatMessages: [],
        newMessage: '',
        newRoomName: '',
        
        // Toast
        toast: {
            show: false,
            message: '',
            type: 'success'
        },
        
        // Initialization
        async init() {
            await this.loadConfig();
            this.initTheme();
            await this.loadRooms();
            await this.loadMetrics();
            this.checkHealth();
            this.initCharts();
            
            // Auto refresh data
            setInterval(() => {
                this.loadRooms();
                this.loadMetrics();
                this.checkHealth();
            }, 30000);
            
            // Create icons
            this.$nextTick(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        },
        
        // Configuration Management
        loadConfig() {
            const saved = localStorage.getItem('roomstream-config');
            if (saved) {
                this.config = { ...this.config, ...JSON.parse(saved) };
            }
            
            const savedTheme = localStorage.getItem('roomstream-theme');
            if (savedTheme) {
                this.darkMode = savedTheme === 'dark';
            }
            
            const savedSidebar = localStorage.getItem('roomstream-sidebar');
            if (savedSidebar !== null) {
                this.sidebarOpen = JSON.parse(savedSidebar);
            }
        },
        
        saveConfig() {
            localStorage.setItem('roomstream-config', JSON.stringify(this.config));
            localStorage.setItem('roomstream-theme', this.darkMode ? 'dark' : 'light');
            localStorage.setItem('roomstream-sidebar', JSON.stringify(this.sidebarOpen));
            this.showToast('Configurações salvas!');
        },
        
        // Theme Management
        initTheme() {
            if (this.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        
        toggleTheme() {
            this.darkMode = !this.darkMode;
            document.documentElement.classList.toggle('dark', this.darkMode);
            this.saveConfig();
        },
        
        // Data Loading
        async loadRooms() {
            try {
                const response = await fetch(`${this.config.baseUrl}/room`);
                if (response.ok) {
                    this.rooms = await response.json();
                    this.metrics.totalRooms = this.rooms.length;
                }
            } catch (error) {
                console.error('Erro ao carregar rooms:', error);
            }
        },
        
        async loadMetrics() {
            try {
                const response = await fetch(`${this.config.baseUrl}/metrics`);
                if (response.ok) {
                    const data = await response.json();
                    this.metrics = {
                        totalRooms: data.totalRooms || this.rooms.length,
                        onlineUsers: data.totalClients || 0,
                        messagesPerMin: this.calculateMessagesPerMinute(data),
                        uptime: data.uptime || '0s'
                    };
                }
            } catch (error) {
                console.error('Erro ao carregar métricas:', error);
            }
        },
        
        async checkHealth() {
            try {
                const response = await fetch(`${this.config.baseUrl}/health`);
                this.healthStatus = response.ok ? 'healthy' : 'unhealthy';
            } catch (error) {
                this.healthStatus = 'unhealthy';
            }
        },
        
        // Room Management
        async createRoom() {
            if (!this.newRoomName.trim()) return;
            
            try {
                const response = await fetch(`${this.config.baseUrl}/room`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: this.newRoomName })
                });
                
                if (response.ok) {
                    const room = await response.json();
                    this.rooms.push(room);
                    this.newRoomName = '';
                    this.showToast(`Room "${room.name}" criada com sucesso!`);
                }
            } catch (error) {
                this.showToast('Erro ao criar room', 'error');
            }
        },
        
        async deleteRoom(roomId) {
            if (!confirm('Tem certeza que deseja deletar esta room?')) return;
            
            try {
                const response = await fetch(`${this.config.baseUrl}/room/${roomId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    this.rooms = this.rooms.filter(room => room.id !== roomId);
                    if (this.selectedRoom?.id === roomId) {
                        this.selectedRoom = null;
                    }
                    this.showToast('Room deletada com sucesso!');
                }
            } catch (error) {
                this.showToast('Erro ao deletar room', 'error');
            }
        },
        
        // Chat Management
        toggleChat() {
            this.chatOpen = !this.chatOpen;
            if (this.chatOpen && this.selectedRoom) {
                // Connect to WebSocket for the selected room
                this.connectToRoom(this.selectedRoom.id);
            }
        },
        
        connectToRoom(roomId) {
            // WebSocket connection logic would go here
            console.log(`Connecting to room: ${roomId}`);
            // For now, simulate some messages
            this.chatMessages = [
                { id: 1, clientId: 'user1', message: 'Olá pessoal!', timestamp: new Date() },
                { id: 2, clientId: 'user2', message: 'Como estão?', timestamp: new Date() }
            ];
        },
        
        sendMessage() {
            if (!this.newMessage.trim()) return;
            
            const message = {
                id: Date.now(),
                clientId: 'admin',
                message: this.newMessage,
                timestamp: new Date()
            };
            
            this.chatMessages.push(message);
            this.newMessage = '';
            
            // Here you would send the message via WebSocket
        },
        
        // Charts
        initCharts() {
            this.$nextTick(() => {
                const ctx = document.getElementById('messagesChart');
                if (ctx) {
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                            datasets: [{
                                label: 'Mensagens por Hora',
                                data: [30, 45, 120, 200, 180, 160],
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            });
        },
        
        // Computed Properties
        get totalOnlineUsers() {
            return this.rooms.reduce((total, room) => {
                return total + (room.participants?.length || 0);
            }, 0);
        },
        
        get messagesPerMinute() {
            const totalMessages = this.rooms.reduce((total, room) => {
                return total + (room.messages?.length || 0);
            }, 0);
            
            // Simple calculation based on uptime
            return Math.floor(totalMessages / 60) || 0;
        },
        
        get systemUptime() {
            return this.metrics.uptime || '0s';
        },
        
        get topActiveRooms() {
            return [...this.rooms]
                .sort((a, b) => (b.messages?.length || 0) - (a.messages?.length || 0))
                .slice(0, 5);
        },
        
        // View Management
        getViewTitle() {
            const titles = {
                dashboard: 'Dashboard',
                rooms: 'Gerenciar Rooms',
                settings: 'Configurações'
            };
            return titles[this.currentView] || 'Dashboard';
        },
        
        getViewDescription() {
            const descriptions = {
                dashboard: 'Visão geral do sistema e métricas em tempo real',
                rooms: 'Gerencie rooms ativas e visualize detalhes',
                settings: 'Configure conexões e preferências do sistema'
            };
            return descriptions[this.currentView] || '';
        },
        
        // Utility Methods
        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('pt-BR');
        },
        
        formatTime(timestamp) {
            if (!timestamp) return '';
            return new Date(timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        calculateMessagesPerMinute(data) {
            const totalMessages = data.totalMessages || 0;
            const uptimeMs = data.uptime || 0;
            const minutes = uptimeMs / (1000 * 60);
            return minutes > 0 ? Math.round(totalMessages / minutes) : 0;
        },
        
        // Toast System
        showToast(message, type = 'success') {
            this.toast = { show: true, message, type };
            setTimeout(() => {
                this.toast.show = false;
            }, 3000);
            
            this.$nextTick(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
    }
}

// Initialize lucide icons after page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
});

// Export for global access
window.roomStreamApp = roomStreamApp;