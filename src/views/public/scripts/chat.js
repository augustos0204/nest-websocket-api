// RoomStream Admin - Chat Module
function chatModule() {
    return {
        // Local UI State only
        typing: false,
        typingUsers: new Set(),
        
        // Settings
        autoScroll: true,
        soundEnabled: true,
        notificationsEnabled: true,
        
        // Initialization
        init() {
            this.loadSettings();
            this.initNotifications();
        },
        
        // Access parent state
        get chatOpen() {
            return this.$parent.chatOpen;
        },
        
        get chatExpanded() {
            return this.$parent.chatExpanded;
        },
        
        get chatMessages() {
            return this.$parent.chatMessages;
        },
        
        get newMessage() {
            return this.$parent.newMessage;
        },
        
        set newMessage(value) {
            this.$parent.newMessage = value;
        },
        
        get selectedRoom() {
            return this.$parent.selectedRoom;
        },
        
        get connected() {
            return this.$parent.connected || false;
        },
        
        get connecting() {
            return this.$parent.connecting || false;
        },
        
        // Chat actions
        toggleChat() {
            this.$parent.toggleChat();
        },
        
        connectToRoom(room) {
            this.$parent.connectToRoom(room.id);
        },
        
        sendMessage() {
            this.$parent.sendMessage();
        },
        
        // UI Management
        scrollToBottom() {
            const messagesContainer = this.$refs.messagesContainer;
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        },
        
        handleKeydown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            } else if (event.key !== 'Enter') {
                this.onTyping();
            }
        },
        
        // Typing Indicators
        onTyping() {
            if (!this.typing && this.connected) {
                this.typing = true;
                // Auto stop typing after 3 seconds
                setTimeout(() => {
                    if (this.typing) {
                        this.stopTyping();
                    }
                }, 3000);
            }
        },
        
        stopTyping() {
            if (this.typing) {
                this.typing = false;
            }
        },
        
        // Settings Management
        loadSettings() {
            const settings = localStorage.getItem('roomstream-chat-settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.soundEnabled = parsed.soundEnabled !== false;
                this.notificationsEnabled = parsed.notificationsEnabled !== false;
                this.autoScroll = parsed.autoScroll !== false;
            }
        },
        
        saveSettings() {
            const settings = {
                soundEnabled: this.soundEnabled,
                notificationsEnabled: this.notificationsEnabled,
                autoScroll: this.autoScroll
            };
            localStorage.setItem('roomstream-chat-settings', JSON.stringify(settings));
        },
        
        // Notifications
        async initNotifications() {
            if ('Notification' in window && this.notificationsEnabled) {
                if (Notification.permission === 'default') {
                    await Notification.requestPermission();
                }
            }
        },
        
        showDesktopNotification(message) {
            if ('Notification' in window && 
                Notification.permission === 'granted' && 
                this.notificationsEnabled &&
                document.hidden) {
                
                new Notification(`${message.author} - ${this.selectedRoom?.name}`, {
                    body: message.content,
                    icon: '/admin/assets/images/logo.png',
                    tag: 'roomstream-message'
                });
            }
        },
        
        playNotificationSound() {
            if (this.soundEnabled) {
                // Create a simple notification sound
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                    
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                } catch (error) {
                    console.warn('Could not play notification sound:', error);
                }
            }
        },
        
        // Computed Properties
        get typingText() {
            const users = Array.from(this.typingUsers);
            if (users.length === 0) return '';
            if (users.length === 1) return `${users[0]} está digitando...`;
            if (users.length === 2) return `${users[0]} e ${users[1]} estão digitando...`;
            return `${users[0]} e mais ${users.length - 1} pessoas estão digitando...`;
        },
        
        get connectionStatus() {
            if (this.connecting) return { text: 'Conectando...', color: 'text-yellow-600' };
            if (this.connected) return { text: 'Conectado', color: 'text-green-600' };
            return { text: 'Desconectado', color: 'text-red-600' };
        },
        
        // Utility Methods
        formatTime(date) {
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        formatDate(date) {
            const today = new Date();
            const messageDate = new Date(date);
            
            if (messageDate.toDateString() === today.toDateString()) {
                return 'Hoje';
            }
            
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (messageDate.toDateString() === yesterday.toDateString()) {
                return 'Ontem';
            }
            
            return messageDate.toLocaleDateString('pt-BR');
        },
        
        getMessageAuthorInitials(message) {
            if (message.isSystem) return 'S';
            
            return message.author.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        },
        
        // Actions
        toggleSound() {
            this.soundEnabled = !this.soundEnabled;
            this.saveSettings();
            this.$parent.showToast(
                'Som ' + (this.soundEnabled ? 'ativado' : 'desativado'),
                'Configuração salva',
                'info'
            );
        },
        
        toggleNotifications() {
            this.notificationsEnabled = !this.notificationsEnabled;
            this.saveSettings();
            
            if (this.notificationsEnabled) {
                this.initNotifications();
            }
            
            this.$parent.showToast(
                'Notificações ' + (this.notificationsEnabled ? 'ativadas' : 'desativadas'),
                'Configuração salva',
                'info'
            );
        },
        
        toggleAutoScroll() {
            this.autoScroll = !this.autoScroll;
            this.saveSettings();
            
            if (this.autoScroll) {
                this.scrollToBottom();
            }
        },
        
        clearMessages() {
            if (confirm('Tem certeza que deseja limpar todas as mensagens?')) {
                this.$parent.chatMessages = [];
                this.$parent.showToast('Mensagens limpas', 'Histórico de mensagens removido', 'info');
            }
        }
    }
}

// Export for global access
window.chatModule = chatModule;