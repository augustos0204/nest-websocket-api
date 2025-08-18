// RoomStream Admin - Edit Module
function editModule() {
    return {
        // Edit State
        activeEdit: null,
        editType: null, // 'room', 'participant', 'message'
        originalValue: '',
        currentValue: '',
        saving: false,
        
        // Edit History
        editHistory: [],
        maxHistorySize: 50,
        
        // Initialization
        init() {
            this.loadEditHistory();
            this.initKeyboardShortcuts();
        },
        
        // Edit Management
        startEdit(item, type, field = 'name') {
            // Cancel any existing edit
            this.cancelEdit();
            
            this.activeEdit = {
                item: item,
                field: field,
                id: item.id || item.clientId
            };
            this.editType = type;
            this.originalValue = this.getFieldValue(item, field);
            this.currentValue = this.originalValue;
            
            // Focus input after DOM update
            this.$nextTick(() => {
                const input = this.getEditInput();
                if (input) {
                    input.focus();
                    input.select();
                }
            });
            
            this.logEditAction('start', type, field, this.originalValue);
        },
        
        async saveEdit() {
            if (this.saving || !this.activeEdit) return;
            
            // Check if value actually changed
            if (this.currentValue === this.originalValue) {
                this.cancelEdit();
                return;
            }
            
            try {
                this.saving = true;
                this.logEditAction('save', this.editType, this.activeEdit.field, this.currentValue);
                this.updateItemInPlace();
                this.cancelEdit();
                this.$parent.showToast('Salvo', 'Alteração salva com sucesso', 'success');
                
            } catch (error) {
                console.error('Erro ao salvar edição:', error);
                this.$parent.showToast('Erro', 'Não foi possível salvar a alteração', 'error');
                this.logEditAction('error', this.editType, this.activeEdit.field, error.message);
            } finally {
                this.saving = false;
            }
        },
        
        cancelEdit() {
            if (this.activeEdit) {
                this.logEditAction('cancel', this.editType, this.activeEdit.field, this.originalValue);
            }
            
            this.activeEdit = null;
            this.editType = null;
            this.originalValue = '';
            this.currentValue = '';
            this.saving = false;
        },
        
        // Utility Methods
        getFieldValue(item, field) {
            if (field === 'content') return item.message || item.content || '';
            return item[field] || '';
        },
        
        updateItemInPlace() {
            // Update the item in place
            const field = this.activeEdit.field;
            if (field === 'content') {
                this.activeEdit.item.message = this.currentValue;
                this.activeEdit.item.content = this.currentValue;
            } else {
                this.activeEdit.item[field] = this.currentValue;
            }
        },
        
        getEditInput() {
            return document.querySelector('.inline-edit-input:focus') || 
                   document.querySelector(`[data-edit-id="${this.activeEdit.id}"] .inline-edit-input`);
        },
        
        // Edit History
        logEditAction(action, type, field, value) {
            const entry = {
                id: Date.now(),
                timestamp: new Date(),
                action: action,
                type: type,
                field: field,
                value: value,
                itemId: this.activeEdit?.id
            };
            
            this.editHistory.unshift(entry);
            
            // Limit history size
            if (this.editHistory.length > this.maxHistorySize) {
                this.editHistory = this.editHistory.slice(0, this.maxHistorySize);
            }
            
            this.saveEditHistory();
        },
        
        loadEditHistory() {
            const saved = localStorage.getItem('roomstream-edit-history');
            if (saved) {
                try {
                    this.editHistory = JSON.parse(saved);
                } catch (error) {
                    console.error('Erro ao carregar histórico de edições:', error);
                    this.editHistory = [];
                }
            }
        },
        
        saveEditHistory() {
            try {
                localStorage.setItem('roomstream-edit-history', JSON.stringify(this.editHistory));
            } catch (error) {
                console.error('Erro ao salvar histórico de edições:', error);
            }
        },
        
        clearEditHistory() {
            if (confirm('Tem certeza que deseja limpar o histórico de edições?')) {
                this.editHistory = [];
                this.saveEditHistory();
                this.$parent.showToast('Histórico limpo', 'Histórico de edições removido', 'info');
            }
        },
        
        // Keyboard Shortcuts
        initKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Only handle shortcuts when editing
                if (!this.activeEdit) return;
                
                // Enter: Save edit
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.saveEdit();
                }
                
                // Escape: Cancel edit
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.cancelEdit();
                }
                
                // Ctrl/Cmd + S: Save edit
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    e.preventDefault();
                    this.saveEdit();
                }
            });
        },
        
        // Input Handlers
        onInputChange(event) {
            this.currentValue = event.target.value;
        },
        
        onInputKeydown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.saveEdit();
            } else if (event.key === 'Escape') {
                event.preventDefault();
                this.cancelEdit();
            }
        },
        
        onInputBlur() {
            // Auto-save on blur if value changed
            if (this.currentValue !== this.originalValue) {
                this.saveEdit();
            } else {
                this.cancelEdit();
            }
        },
        
        // Computed Properties
        get isEditing() {
            return this.activeEdit !== null;
        },
        
        get editingId() {
            return this.activeEdit?.id;
        },
        
        get canSave() {
            return this.currentValue !== this.originalValue && !this.saving;
        },
        
        get recentEdits() {
            return this.editHistory.slice(0, 10);
        },
        
        // Helper Methods for Templates
        isEditingItem(item, field = 'name') {
            if (!this.activeEdit) return false;
            const itemId = item.id || item.clientId;
            return this.activeEdit.id === itemId && this.activeEdit.field === field;
        },
        
        getEditValue(item, field = 'name') {
            if (this.isEditingItem(item, field)) {
                return this.currentValue;
            }
            return this.getFieldValue(item, field);
        },
        
        formatEditHistoryEntry(entry) {
            const time = entry.timestamp.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            let action = '';
            switch (entry.action) {
                case 'start': action = 'Iniciou edição'; break;
                case 'save': action = 'Salvou'; break;
                case 'cancel': action = 'Cancelou'; break;
                case 'error': action = 'Erro'; break;
                default: action = entry.action;
            }
            
            return `${time} - ${action} ${entry.type}.${entry.field}`;
        }
    }
}

// Export for global access
window.editModule = editModule;