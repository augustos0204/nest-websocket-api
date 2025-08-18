// RoomStream Admin - Dashboard Module
function dashboardModule() {
    return {
        // Initialization
        init() {
            // Dashboard-specific initialization
            console.log('Dashboard module initialized');
        },
        
        // Computed properties for dashboard
        get totalRooms() {
            return this.$parent.rooms.length;
        },
        
        get totalOnlineUsers() {
            return this.$parent.totalOnlineUsers;
        },
        
        get messagesPerMinute() {
            return this.$parent.messagesPerMinute;
        },
        
        get systemUptime() {
            return this.$parent.systemUptime;
        },
        
        get topActiveRooms() {
            return this.$parent.topActiveRooms;
        }
    }
}

// Export for global access
window.dashboardModule = dashboardModule;