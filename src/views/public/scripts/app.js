function socketTester() {
    return {
        // Connection state
        socket: null,
        isConnected: false,
        connecting: false,
        
        // Form data
        namespace: 'http://localhost:4000/ws/rooms',
        newRoomName: '',
        deleteRoomId: '',
        roomId: 'test-room',
        participantName: 'Tester',
        message: '',
        
        // Current room state
        currentRoomId: null,
        currentRoomName: null,
        
        // Data
        rooms: [],
        roomParticipants: [],
        logs: [], // Global logs
        roomLogs: [], // Room-specific logs
        autoScroll: true,
        
        // Mobile navigation
        mobileSection: 'rooms', // 'rooms', 'chat', 'participants'
        urlInputExpanded: false, // Control mobile URL input expansion
        
        // Initialize
        init() {
            this.log('🚀 Socket.IO Tester carregado', 'success');
            this.log('💡 Clique em "Conectar" para começar', 'info');
            this.listRooms();
            
            // Initialize Lucide icons
            lucide.createIcons();
        },
        
        // Room management
        openRoom(roomId, roomName) {
            if (!this.isConnected) {
                this.roomLog('❌ Conecte-se primeiro ao WebSocket', 'error');
                return;
            }
            
            // Validate participant name
            const trimmedName = this.participantName?.trim();
            if (!trimmedName) {
                this.roomLog('⚠️ Aviso: Entrando como usuário anônimo (defina seu nome na sidebar)', 'info');
            }
            
            // Leave current room if any
            if (this.currentRoomId) {
                this.socket.emit('leaveRoom', { roomId: this.currentRoomId });
            }
            
            // Set new room
            this.currentRoomId = roomId;
            this.currentRoomName = roomName;
            this.roomLogs = [];
            this.roomParticipants = [];
            
            // Join new room with validated name
            this.roomLog(`🚪 Abrindo sala: <strong>${roomName}</strong> como <strong>${trimmedName || 'Anônimo'}</strong>`, 'info');
            this.socket.emit('joinRoom', { 
                roomId: roomId, 
                participantName: trimmedName || null 
            });
            
            // Auto-navigate to chat section on mobile
            if (window.innerWidth < 1024) {
                this.mobileSection = 'chat';
            }
        },
        
        // Update participant name in current room
        updateMyName() {
            if (!this.isConnected || !this.currentRoomId) {
                this.roomLog('❌ Você precisa estar conectado e em uma sala para atualizar seu nome', 'error');
                return;
            }
            
            const trimmedName = this.participantName?.trim();
            this.socket.emit('updateParticipantName', {
                roomId: this.currentRoomId,
                participantName: trimmedName || null
            });
            
            this.roomLog(`📝 Atualizando nome para: <strong>${trimmedName || 'Anônimo'}</strong>`, 'info');
        },
        
        leaveCurrentRoom() {
            if (!this.currentRoomId) return;
            
            this.socket.emit('leaveRoom', { roomId: this.currentRoomId });
            this.currentRoomId = null;
            this.currentRoomName = null;
            this.roomLogs = [];
            this.roomParticipants = [];
        },
        
        // Room-specific logging
        roomLog(message, type = 'info', sender = null, originalTimestamp = null, displayName = null, clientId = null) {
            const timestamp = originalTimestamp ? new Date(originalTimestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
            const fullTimestamp = originalTimestamp ? new Date(originalTimestamp).toLocaleString() : new Date().toLocaleString();
            this.roomLogs.push({ 
                message, 
                type, 
                timestamp, 
                fullTimestamp, 
                sender, 
                displayName: displayName || sender,
                clientId 
            });
            
            if (this.autoScroll) {
                this.$nextTick(() => {
                    const container = this.$refs.roomLogContainer;
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                    }
                });
            }
        },
        
        clearRoomLogs() {
            this.roomLogs = [];
        },
        
        // Logging
        log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            this.logs.push({ message, type, timestamp });
            
            if (this.autoScroll) {
                this.$nextTick(() => {
                    const container = this.$refs.logContainer;
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                    }
                });
            }
        },
        
        clearLog() {
            this.logs = [];
        },
        
        getLogClass(type) {
            const classes = {
                connected: 'text-green-400',
                disconnected: 'text-red-400',
                message: 'text-yellow-400',
                error: 'text-red-400',
                info: 'text-blue-400',
                success: 'text-green-300'
            };
            return classes[type] || 'text-gray-300';
        },
        
        getLogIcon(type) {
            const icons = {
                connected: 'wifi',
                disconnected: 'wifi-off',
                message: 'message-circle',
                error: 'alert-circle',
                info: 'info',
                success: 'check-circle'
            };
            return icons[type] || 'circle';
        },
        
        // Connection methods
        toggleConnection() {
            if (this.isConnected) {
                this.disconnect();
            } else {
                this.connect();
            }
        },
        
        connect() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
            
            this.connecting = true;
            this.isConnected = false;
            this.log(`Conectando ao namespace: ${this.namespace}`, 'info');
            
            try {
                // Extract namespace from full URL if provided
                let socketUrl, namespace;
                if (this.namespace.startsWith('http')) {
                    const url = new URL(this.namespace);
                    socketUrl = `${url.protocol}//${url.host}`;
                    namespace = url.pathname;
                } else {
                    socketUrl = window.location.origin;
                    namespace = this.namespace;
                }
                
                console.log('Connecting to:', socketUrl, 'namespace:', namespace);
                
                // Connect to namespace directly
                this.socket = io(socketUrl + namespace, {
                    forceNew: true,
                    timeout: 5000,
                    transports: ['websocket', 'polling']
                });
                
            } catch (e) {
                this.connecting = false;
                this.log('❌ URL inválida. Use formato: http://localhost:4000/ws/rooms', 'error');
                console.error('URL parsing error:', e);
                return;
            }
            
            this.socket.on('connect', () => {
                this.isConnected = true;
                this.connecting = false;
                this.log(`✅ Conectado! Socket ID: ${this.socket.id}`, 'connected');
            });
            
            this.socket.on('disconnect', (reason) => {
                this.isConnected = false;
                this.connecting = false;
                this.log(`❌ Desconectado: ${reason}`, 'disconnected');
            });
            
            this.socket.on('connect_error', (error) => {
                this.isConnected = false;
                this.connecting = false;
                this.log(`❌ Erro de conexão: ${error.message}`, 'error');
                console.error('Connection error:', error);
            });
            
            this.socket.on('error', (error) => {
                this.connecting = false;
                this.log(`❌ Erro: ${JSON.stringify(error)}`, 'error');
            });
            
            // Timeout de segurança para evitar loading infinito
            setTimeout(() => {
                if (this.connecting && !this.isConnected) {
                    this.connecting = false;
                    this.log('❌ Timeout na conexão - verifique a URL', 'error');
                }
            }, 10000); // 10 segundos
            
            // Room events
            this.socket.on('joinedRoom', (data) => {
                this.log(`🚪 Entrou na room: <strong>${data.roomName}</strong> (ID: ${data.roomId})<br>Participantes: ${data.participants.length}<br>Mensagens recentes: ${data.recentMessages.length}`, 'success');
                
                // Room-specific log
                this.roomLog(`✅ Conectado à sala <strong>${data.roomName}</strong>`, 'success');
                this.roomLog(`👥 ${data.participants.length} participantes na sala`, 'info');
                
                // Update participants with proper structure
                console.log('Participants received:', data.participants);
                this.roomParticipants = data.participants || [];
                
                // Log participant names for debugging
                if (data.participants && data.participants.length > 0) {
                    this.roomLog(`📋 <strong>Participantes:</strong><br>${data.participants.map(p => `• ${p.name || 'Anônimo'} (${p.clientId})`).join('<br>')}`, 'info');
                }
                
                // Show recent messages
                if (data.recentMessages && data.recentMessages.length > 0) {
                    this.roomLog(`📜 Carregando ${data.recentMessages.length} mensagens recentes...`, 'info');
                    data.recentMessages.forEach(msg => {
                        // Find sender name from participants
                        const sender = data.participants.find(p => p.clientId === msg.clientId);
                        let senderName, displayName;
                        
                        if (sender?.name) {
                            senderName = sender.name;
                            displayName = sender.name;
                        } else {
                            senderName = 'Usuário Anônimo';
                            displayName = `Usuário Anônimo • ${msg.clientId}`;
                        }
                        
                        this.roomLog(msg.message, 'user_message', senderName, msg.timestamp, displayName, msg.clientId);
                    });
                }
            });
            
            this.socket.on('leftRoom', (data) => {
                this.log(`🚪 Saiu da room: ${data.roomId}`, 'info');
                if (this.currentRoomId === data.roomId) {
                    this.roomLog(`👋 Você saiu da sala`, 'info');
                }
            });
            
            this.socket.on('userJoined', (data) => {
                this.log(`👤 <strong>${data.participantName || 'Usuário anônimo'}</strong> entrou na room <strong>${data.roomName}</strong>`, 'message');
                
                if (this.currentRoomId === data.roomId) {
                    this.roomLog(`👤 <strong>${data.participantName || 'Usuário anônimo'}</strong> entrou na sala`, 'success');
                    // Refresh participants when someone joins
                    this.getRoomInfo();
                }
            });
            
            this.socket.on('userLeft', (data) => {
                this.log(`👤 <strong>${data.participantName || 'Usuário anônimo'}</strong> saiu da room <strong>${data.roomName}</strong>`, 'message');
                
                if (this.currentRoomId === data.roomId) {
                    this.roomLog(`👋 <strong>${data.participantName || 'Usuário anônimo'}</strong> saiu da sala`, 'info');
                    // Refresh participants when someone leaves
                    this.getRoomInfo();
                }
            });
            
            this.socket.on('newMessage', (data) => {
                this.log(`💬 <strong>Nova mensagem</strong> na room ${data.roomId}:<br><em>"${data.message}"</em>`, 'message');
                
                if (this.currentRoomId === data.roomId) {
                    const isMyMessage = data.clientId === this.socket.id;
                    let senderName;
                    let displayName;
                    
                    if (isMyMessage) {
                        senderName = 'Você';
                        displayName = 'Você';
                    } else {
                        // Find sender name from participants list
                        const sender = this.roomParticipants.find(p => p.clientId === data.clientId);
                        if (sender?.name) {
                            senderName = sender.name;
                            displayName = sender.name;
                        } else {
                            senderName = 'Usuário Anônimo';
                            displayName = `Usuário Anônimo • ${data.clientId}`;
                        }
                    }
                    
                    this.roomLog(data.message, 'user_message', senderName, data.timestamp, displayName, data.clientId);
                }
            });
            
            this.socket.on('roomInfo', (data) => {
                this.log(`ℹ️ <strong>Info da Room:</strong><br>Nome: ${data.name}<br>Participantes: ${data.participantCount}<br>Mensagens: ${data.messageCount}<br>Criada em: ${new Date(data.createdAt).toLocaleString()}`, 'info');
                
                // Update participants list
                if (this.currentRoomId === data.id) {
                    console.log('Room info participants:', data.participants);
                    this.roomParticipants = data.participants || [];
                    this.roomLog(`ℹ️ <strong>Informações atualizadas:</strong><br>Participantes: ${data.participantCount}<br>Mensagens: ${data.messageCount}`, 'info');
                    
                    // Debug participants structure
                    if (data.participants && data.participants.length > 0) {
                        this.roomLog(`📋 <strong>Lista atualizada:</strong><br>${data.participants.map(p => `• ${p.name || 'Anônimo'} (${p.clientId})`).join('<br>')}`, 'info');
                    }
                }
            });
            
            this.socket.on('participantNameUpdated', (data) => {
                this.log(`📝 Nome atualizado: ${data.participantName || 'Anônimo'} (${data.clientId})`, 'info');
                
                if (this.currentRoomId === data.roomId) {
                    const isMe = data.clientId === this.socket.id;
                    this.roomLog(`📝 <strong>${isMe ? 'Você' : 'Usuário'}</strong> alterou nome para: <strong>${data.participantName || 'Anônimo'}</strong>`, isMe ? 'success' : 'info');
                    
                    // Refresh participants list to reflect name change
                    this.getRoomInfo();
                }
            });
        },
        
        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
            this.isConnected = false;
            this.connecting = false;
        },
        
        // Room management
        async createRoom() {
            if (!this.newRoomName.trim()) {
                this.log('❌ Nome da sala é obrigatório', 'error');
                return;
            }
            
            try {
                const response = await fetch('/room', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: this.newRoomName.trim() })
                });
                
                if (response.ok) {
                    const room = await response.json();
                    this.log(`✅ Sala criada com sucesso!<br>Nome: <strong>${room.name}</strong><br>ID: <strong>${room.id}</strong>`, 'success');
                    this.newRoomName = '';
                    this.listRooms();
                } else {
                    const error = await response.json();
                    this.log(`❌ Erro ao criar sala: ${error.message}`, 'error');
                }
            } catch (error) {
                this.log(`❌ Erro de rede: ${error.message}`, 'error');
            }
        },
        
        async listRooms() {
            try {
                const response = await fetch('/room');
                if (response.ok) {
                    this.rooms = await response.json();
                    this.log(`📋 Listadas ${this.rooms.length} salas`, 'info');
                } else {
                    this.log('❌ Erro ao listar salas', 'error');
                }
            } catch (error) {
                this.log(`❌ Erro de rede: ${error.message}`, 'error');
            }
        },
        
        async deleteRoom() {
            if (!this.deleteRoomId.trim()) {
                this.log('❌ ID da sala é obrigatório', 'error');
                return;
            }
            
            if (!confirm(`Tem certeza que deseja deletar a sala ${this.deleteRoomId}?`)) {
                return;
            }
            
            try {
                const response = await fetch(`/room/${this.deleteRoomId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    const result = await response.json();
                    this.log(`✅ ${result.message}`, 'success');
                    this.deleteRoomId = '';
                    this.listRooms();
                } else {
                    const error = await response.json();
                    this.log(`❌ Erro ao deletar sala: ${error.message}`, 'error');
                }
            } catch (error) {
                this.log(`❌ Erro de rede: ${error.message}`, 'error');
            }
        },
        
        // Room actions
        joinRoom() {
            if (!this.socket || !this.socket.connected) {
                this.log('❌ Socket não conectado', 'error');
                return;
            }
            
            if (!this.roomId.trim()) {
                this.log('❌ Room ID é obrigatório', 'error');
                return;
            }
            
            this.log(`🚪 Entrando na room: <strong>${this.roomId}</strong> como <strong>${this.participantName || 'Anônimo'}</strong>`, 'info');
            this.socket.emit('joinRoom', { 
                roomId: this.roomId, 
                participantName: this.participantName || null 
            });
        },
        
        leaveRoom() {
            if (!this.socket || !this.socket.connected) {
                this.log('❌ Socket não conectado', 'error');
                return;
            }
            
            if (!this.roomId.trim()) {
                this.log('❌ Room ID é obrigatório', 'error');
                return;
            }
            
            this.log(`🚪 Saindo da room: <strong>${this.roomId}</strong>`, 'info');
            this.socket.emit('leaveRoom', { roomId: this.roomId });
        },
        
        getRoomInfo() {
            if (!this.socket || !this.socket.connected) {
                this.log('❌ Socket não conectado', 'error');
                return;
            }
            
            const targetRoomId = this.currentRoomId || this.roomId.trim();
            if (!targetRoomId) {
                this.log('❌ Room ID é obrigatório', 'error');
                return;
            }
            
            this.log(`ℹ️ Obtendo info da room: <strong>${targetRoomId}</strong>`, 'info');
            this.socket.emit('getRoomInfo', { roomId: targetRoomId });
        },
        
        sendMessage() {
            if (!this.socket || !this.socket.connected) {
                this.roomLog('❌ Socket não conectado', 'error');
                return;
            }
            
            if (!this.currentRoomId || !this.message.trim()) {
                this.roomLog('❌ Selecione uma sala e digite uma mensagem', 'error');
                return;
            }
            
            this.log(`💬 Enviando mensagem para room <strong>${this.currentRoomId}</strong>: <em>"${this.message}"</em>`, 'info');
            this.socket.emit('sendMessage', { 
                roomId: this.currentRoomId, 
                message: this.message 
            });
            this.message = '';
        },
        
        // Mobile navigation
        setMobileSection(section) {
            this.mobileSection = section;
            
            // Auto-switch to chat when opening a room on mobile
            if (section === 'chat' && !this.currentRoomId) {
                this.mobileSection = 'rooms';
            }
        },
        
        // URL input expansion for mobile
        expandUrlInput() {
            this.urlInputExpanded = true;
            this.$nextTick(() => {
                const input = this.$refs.urlInput;
                if (input) {
                    input.focus();
                }
            });
        },
        
        closeUrlInput() {
            this.urlInputExpanded = false;
        }
    }
}

// Initialize Lucide icons after Alpine loads
document.addEventListener('alpine:init', () => {
    setTimeout(() => lucide.createIcons(), 100);
});