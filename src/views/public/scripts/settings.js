// RoomStream Admin - Settings Module
function settingsModule() {
    return {
        // Settings state
        tempConfig: {},
        
        // Initialization
        init() {
            this.loadTempConfig();
        },
        
        // Access parent config
        get config() {
            return this.$parent.config;
        },
        
        get darkMode() {
            return this.$parent.darkMode;
        },
        
        // Load temporary config for editing
        loadTempConfig() {
            this.tempConfig = { ...this.config };
        },
        
        // Save configuration
        saveConfig() {
            // Update parent config
            Object.assign(this.$parent.config, this.tempConfig);
            this.$parent.saveConfig();
        },
        
        // Reset to defaults
        resetToDefaults() {
            if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
                this.tempConfig = {
                    baseUrl: 'http://localhost:3000',
                    websocketNamespace: '/ws/rooms'
                };
            }
        },
        
        // Test connection
        async testConnection() {
            try {
                const response = await fetch(`${this.tempConfig.baseUrl}/health`);
                if (response.ok) {
                    this.$parent.showToast('Conexão OK', 'Servidor acessível', 'success');
                } else {
                    this.$parent.showToast('Conexão falhada', `HTTP ${response.status}`, 'error');
                }
            } catch (error) {
                this.$parent.showToast('Erro de conexão', 'Servidor inacessível', 'error');
            }
        },
        
        // Theme management
        toggleTheme() {
            this.$parent.toggleTheme();
        },
        
        // Export/Import Settings
        exportSettings() {
            const settings = {
                config: this.config,
                darkMode: this.darkMode,
                timestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `roomstream-settings-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.$parent.showToast('Exportado', 'Configurações exportadas', 'success');
        },
        
        importSettings(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    
                    if (settings.config) {
                        this.tempConfig = { ...settings.config };
                    }
                    
                    if (typeof settings.darkMode === 'boolean') {
                        this.$parent.darkMode = settings.darkMode;
                        this.$parent.initTheme();
                    }
                    
                    this.$parent.showToast('Importado', 'Configurações importadas', 'success');
                } catch (error) {
                    this.$parent.showToast('Erro', 'Arquivo de configuração inválido', 'error');
                }
            };
            reader.readAsText(file);
            
            // Reset input
            event.target.value = '';
        },
        
        // Clear all data
        clearAllData() {
            if (confirm('Tem certeza que deseja limpar todos os dados armazenados?\n\nEsta ação irá:\n- Limpar configurações\n- Limpar histórico de edições\n- Limpar configurações de chat\n- Restaurar configurações padrão')) {
                localStorage.clear();
                location.reload();
            }
        }
    }
}

// Export for global access
window.settingsModule = settingsModule;