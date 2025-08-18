// RoomStream Admin - Rooms Module
function roomsModule() {
    return {
        // Local UI State
        loading: false,
        creating: false,
        
        // Filters and Search
        searchQuery: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
        statusFilter: 'all',
        
        // Pagination
        currentPage: 1,
        itemsPerPage: 10,
        
        // Edit State
        editingRoom: null,
        editingParticipant: null,
        editingMessage: null,
        
        // Initialization
        init() {
            // Module-specific initialization
            console.log('Rooms module initialized');
        },
        
        // Computed properties accessing parent state
        get rooms() {
            return this.$parent.rooms;
        },
        
        get selectedRoom() {
            return this.$parent.selectedRoom;
        },
        
        get roomMessages() {
            return this.$parent.selectedRoom?.messages || [];
        },
        
        get roomParticipants() {
            return this.$parent.selectedRoom?.participants || [];
        },
        
        get newRoomName() {
            return this.$parent.newRoomName;
        },
        
        set newRoomName(value) {
            this.$parent.newRoomName = value;
        },
        
        // Room Management
        async createRoom() {
            return await this.$parent.createRoom();
        },
        
        async deleteRoom(roomId) {
            return await this.$parent.deleteRoom(roomId);
        },
        
        // Room Selection
        selectRoom(room) {
            this.$parent.selectedRoom = room;
        },
        
        // Edit Functionality (UI state only)
        startEditRoom(room) {
            this.editingRoom = {
                id: room.id,
                name: room.name,
                description: room.description || ''
            };
        },
        
        cancelRoomEdit() {
            this.editingRoom = null;
        },
        
        startEditParticipant(participant) {
            this.editingParticipant = {
                clientId: participant.clientId,
                name: participant.name || ''
            };
        },
        
        cancelParticipantEdit() {
            this.editingParticipant = null;
        },
        
        // Computed Properties
        get filteredRooms() {
            let filtered = this.rooms;
            
            // Apply search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(room => 
                    room.name.toLowerCase().includes(query) ||
                    (room.description && room.description.toLowerCase().includes(query))
                );
            }
            
            // Apply status filter
            if (this.statusFilter !== 'all') {
                filtered = filtered.filter(room => {
                    const isActive = room.participants && room.participants.length > 0;
                    return this.statusFilter === 'active' ? isActive : !isActive;
                });
            }
            
            // Apply sorting
            filtered.sort((a, b) => {
                let aVal = a[this.sortBy];
                let bVal = b[this.sortBy];
                
                if (this.sortBy === 'created_at') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                
                const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                return this.sortOrder === 'desc' ? -comparison : comparison;
            });
            
            return filtered;
        },
        
        get paginatedRooms() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredRooms.slice(start, end);
        },
        
        get totalPages() {
            return Math.ceil(this.filteredRooms.length / this.itemsPerPage);
        },
        
        get roomStats() {
            return {
                total: this.rooms.length,
                active: this.rooms.filter(r => r.participants && r.participants.length > 0).length,
                inactive: this.rooms.filter(r => !r.participants || r.participants.length === 0).length
            };
        },
        
        // Utility Methods
        getRoomStatus(room) {
            const hasParticipants = room.participants && room.participants.length > 0;
            return hasParticipants ? 'online' : 'offline';
        },
        
        getRoomStatusText(room) {
            const hasParticipants = room.participants && room.participants.length > 0;
            return hasParticipants ? 'Ativa' : 'Inativa';
        },
        
        // Actions
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        
        setSortBy(field) {
            if (this.sortBy === field) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortBy = field;
                this.sortOrder = 'desc';
            }
        },
        
        openChatForRoom(room) {
            this.$parent.currentView = 'chat';
            this.$parent.selectedRoom = room;
        }
    }
}

// Export for global access
window.roomsModule = roomsModule;