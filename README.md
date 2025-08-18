# 🔌 NestJS WebSocket Room API

A robust and scalable WebSocket API built with **NestJS** and **Socket.IO** for creating and managing real-time chat rooms. Features prototype web interfaces for administration and testing functionalities.

> **⚠️ Note**: The web interfaces at `/admin/*` are **prototype/demo versions** for development and testing purposes.

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [WebSocket Events](#-websocket-events)
- [Web Interface](#-web-interface)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features
- **Real-time room creation and management**
- **Participant system** with customizable names
- **Real-time messaging** with persistent history
- **Multiple simultaneous rooms** per user
- **Join/leave events** with notifications
- **Metrics system** for monitoring

### 🛠️ Technical Features
- **Isolated namespace** (`/ws/rooms`) for WebSocket
- **Robust validations** on all endpoints
- **Automatic disconnection handling**
- **Configurable CORS** for different environments
- **Detailed logging** system
- **Modular and scalable** architecture

### 🎨 Prototype Administrative Interface
- **Monitoring dashboard** with real-time metrics (prototype)
- **Room manager** with creation, listing, and deletion (prototype)
- **Integrated chat** for testing and administration (prototype)
- **Complete Socket.IO Tester** for development (prototype)
- **Responsive interface** with Tailwind CSS (prototype)

> **⚠️ Important**: These are prototype interfaces for development/testing only

## 🚀 Technologies

### Backend
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[Socket.IO](https://socket.io/)** - Real-time WebSocket library
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript
- **[@nestjs/event-emitter](https://docs.nestjs.com/techniques/events)** - Event system
- **[@nestjs/config](https://docs.nestjs.com/techniques/configuration)** - Configuration management

### Frontend
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Alpine.js](https://alpinejs.dev/)** - Reactive JavaScript framework
- **HTML5 & JavaScript ES6+** - Modern web technologies

### DevTools
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Code quality
- **[Jest](https://jestjs.io/)** - Testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing

## 📦 Installation

### Prerequisites
- **Node.js** >= 18.x
- **pnpm** >= 8.x (recommended) or npm/yarn

### Clone Repository
```bash
git clone https://github.com/your-username/nest-websocket-api.git
cd nest-websocket-api
```

### Install Dependencies
```bash
pnpm install
# or
npm install
```

## ⚙️ Configuration

### 1. Environment Variables
Copy the example file and configure the variables:

```bash
cp .env.example .env
```

#### Available Variables
```bash
# 🚀 SERVER CONFIGURATION
PORT=4000                    # Server port

# 🌐 CORS CONFIGURATION  
CORS_ORIGIN=*               # Allowed origin (* for development)

# 🔌 WEBSOCKET CONFIGURATION
WEBSOCKET_NAMESPACE=/ws/rooms # Socket.IO namespace

# 📱 APPLICATION SETTINGS
APP_NAME="NestJS WebSocket Room API"
APP_VERSION=1.0.0
```

### 2. Available Scripts

#### Development
```bash
pnpm run start:dev          # Server in watch mode
pnpm run start:debug        # Server with debug enabled
```

#### Production
```bash
pnpm run build             # Build for production
pnpm run start:prod        # Run compiled version
```

#### Code Quality
```bash
pnpm run lint              # Run ESLint
pnpm run format            # Format code with Prettier
```

## 🎯 Usage

### Start Server
```bash
pnpm run start:dev
```

The server will be available at:
- **REST API**: `http://localhost:4000`
- **WebSocket**: `ws://localhost:4000/ws/rooms`
- **Admin Interface**: `http://localhost:4000/admin`
- **Socket.IO Tester**: `http://localhost:4000/admin/socket-tester`

## 📚 API Endpoints

### Rooms

#### Create Room
```http
POST /room
Content-Type: application/json

{
  "name": "My Chat Room"
}
```

#### List All Rooms
```http
GET /room
```

#### Get Specific Room
```http
GET /room/:id
```

#### Delete Room
```http
DELETE /room/:id
```

#### Get Room Messages
```http
GET /room/:id/messages
```

#### Get Room Participants
```http
GET /room/:id/participants
```

### Monitoring

#### Health Check
```http
GET /health
```

#### System Metrics
```http
GET /metrics
```

## 🔌 WebSocket Events

### Connection
Connect to the `/ws/rooms` namespace:

```javascript
const socket = io('http://localhost:4000/ws/rooms');
```

### Client → Server Events

#### Join Room
```javascript
socket.emit('joinRoom', {
  roomId: 'room-id',
  participantName: 'Your Name' // optional
});
```

#### Leave Room
```javascript
socket.emit('leaveRoom', {
  roomId: 'room-id'
});
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  roomId: 'room-id',
  message: 'Your message here'
});
```

#### Get Room Info
```javascript
socket.emit('getRoomInfo', {
  roomId: 'room-id'
});
```

#### Update Participant Name
```javascript
socket.emit('updateParticipantName', {
  roomId: 'room-id',
  participantName: 'New Name'
});
```

### Server → Client Events

#### Joined Room
```javascript
socket.on('joinedRoom', (data) => {
  console.log('Joined room:', data);
  // { roomId, roomName, participants, recentMessages }
});
```

#### User Joined
```javascript
socket.on('userJoined', (data) => {
  console.log('User joined:', data);
  // { clientId, participantName, roomId, roomName, participantCount }
});
```

#### User Left
```javascript
socket.on('userLeft', (data) => {
  console.log('User left:', data);
  // { clientId, participantName, roomId, roomName, participantCount }
});
```

#### New Message
```javascript
socket.on('newMessage', (data) => {
  console.log('New message:', data);
  // { id, clientId, message, timestamp, roomId }
});
```

#### Room Info
```javascript
socket.on('roomInfo', (data) => {
  console.log('Room info:', data);
  // { id, name, participantCount, participants, messageCount, createdAt }
});
```

#### Name Updated
```javascript
socket.on('participantNameUpdated', (data) => {
  console.log('Name updated:', data);
  // { clientId, participantName, roomId }
});
```

#### Errors
```javascript
socket.on('error', (error) => {
  console.error('Error:', error);
  // { message: 'Error description' }
});
```

## 🎨 Prototype Web Interface

> **⚠️ Prototype Notice**: All web interfaces are **prototypes/demos** for development and testing purposes.

### Administrative Dashboard (`/admin`) - **PROTOTYPE**
- **Overview** with real-time metrics
- **Room management** (create, list, delete)
- **Online users** monitor
- **Integrated chat** for administration
- **Customizable settings**

### Socket.IO Tester (`/admin/socket-tester`) - **PROTOTYPE**
Complete interface to test all WebSocket functionalities:

- **WebSocket connection** with visual status
- **Room management** via interface
- **Real-time event testing**
- **Detailed logging** of all actions
- **Responsive interface** with Tailwind CSS

> **ℹ️ Usage**: These interfaces are designed for developers to test and understand the API functionality.

## 📁 Project Structure

```
src/
├── 📁 common/              # Shared utilities
│   └── utils/
│       └── uptime.util.ts
├── 📁 events/              # Event system
│   ├── events.module.ts
│   ├── events.service.ts
│   └── metrics.events.ts
├── 📁 health/              # Health checks
│   ├── health.controller.ts
│   ├── health.module.ts
│   └── health.service.ts
├── 📁 metrics/             # System metrics
│   ├── metrics.controller.ts
│   ├── metrics.module.ts
│   └── metrics.service.ts
├── 📁 room/                # Core - Chat rooms
│   ├── room.controller.ts  # REST endpoints
│   ├── room.gateway.ts     # WebSocket gateway
│   ├── room.module.ts      # Room module
│   └── room.service.ts     # Business logic
├── 📁 views/               # Web interface
│   ├── public/             # Static files
│   │   ├── *.html         # HTML pages
│   │   ├── scripts/       # JavaScript
│   │   └── styles/        # CSS
│   ├── views.controller.ts # Views controller
│   └── views.module.ts     # Views module
├── app.controller.ts       # Main controller
├── app.module.ts          # Root module
├── app.service.ts         # Main service
└── main.ts               # Entry point
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
pnpm run test

# Tests in watch mode
pnpm run test:watch

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

### Manual Testing with HTTP Client

Use the `requests/rooms.http` file to test endpoints:

```http
### Create a room
POST http://localhost:4000/room
Content-Type: application/json

{
  "name": "Test Room"
}

### List all rooms
GET http://localhost:4000/room

### Get specific room
GET http://localhost:4000/room/{{roomId}}
```

## 📊 Monitoring

### Metrics System
The system automatically collects metrics:

- **Connections**: Connected/disconnected users
- **Rooms**: Created/deleted
- **Messages**: Sent per room
- **Participants**: Room join/leave events

### Logs
Detailed logs for all operations:
```bash
[RoomGateway] Client connected on namespace /ws/rooms: abc123
[RoomService] Room created: room_1234567890_abc (My Room)
[RoomGateway] Client abc123 joined room: room_1234567890_abc
```

## 🤝 Contributing

1. **Fork** the project
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add: AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Commit Standards
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Maintenance

## 🚀 Deployment

### Production Variables
```bash
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
WEBSOCKET_NAMESPACE=/ws/rooms
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 📄 License

This project is licensed under the **MIT** License. See the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check this README
- **Issues**: Use [GitHub Issues](https://github.com/your-username/nest-websocket-api/issues)
- **Contact**: Start a discussion in the repository

---

# 🇧🇷 Versão em Português

# 🔌 NestJS WebSocket Room API

Uma API WebSocket robusta e escalável construída com **NestJS** e **Socket.IO** para criação e gerenciamento de salas de chat em tempo real. Oferece interfaces web prototipadas para administração e teste das funcionalidades.

> **⚠️ Nota**: As interfaces web em `/admin/*` são **versões prototipadas/demo** para propósitos de desenvolvimento e teste.

## 📋 Índice

- [Características](#-características-1)
- [Tecnologias](#-tecnologias-1)  
- [Instalação](#-instalação-1)
- [Configuração](#-configuração-1)
- [Uso](#-uso-1)
- [Endpoints da API](#-endpoints-da-api-1)
- [Eventos WebSocket](#-eventos-websocket-1)
- [Interface Web](#-interface-web-1)
- [Estrutura do Projeto](#-estrutura-do-projeto-1)
- [Testes](#-testes-1)
- [Contribuição](#-contribuição-1)
- [Licença](#-licença-1)

## ✨ Características

### 🎯 Funcionalidades Core
- **Criação e gerenciamento de salas** em tempo real
- **Sistema de participantes** com nomes personalizáveis
- **Mensagens em tempo real** com histórico persistente
- **Múltiplas salas simultâneas** por usuário
- **Eventos de entrada/saída** com notificações
- **Sistema de métricas** para monitoramento

### 🛠️ Funcionalidades Técnicas
- **Namespace isolado** (`/ws/rooms`) para WebSocket
- **Validações robustas** em todos os endpoints
- **Tratamento de desconexões** automático
- **CORS configurável** para diferentes ambientes
- **Sistema de logs** detalhado
- **Arquitetura modular** e escalável

### 🎨 Interface Administrativa Prototipada
- **Dashboard de monitoramento** com métricas em tempo real (protótipo)
- **Gerenciador de salas** com criação, listagem e exclusão (protótipo)
- **Chat integrado** para testes e administração (protótipo)
- **Socket.IO Tester** completo para desenvolvimento (protótipo)
- **Interface responsiva** com Tailwind CSS (protótipo)

> **⚠️ Importante**: Estas são interfaces prototipadas apenas para desenvolvimento/teste

## 🚀 Tecnologias

### Backend
- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[Socket.IO](https://socket.io/)** - Biblioteca WebSocket em tempo real
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript tipado
- **[@nestjs/event-emitter](https://docs.nestjs.com/techniques/events)** - Sistema de eventos
- **[@nestjs/config](https://docs.nestjs.com/techniques/configuration)** - Gerenciamento de configurações

### Frontend
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Alpine.js](https://alpinejs.dev/)** - Framework JavaScript reativo
- **HTML5 & JavaScript ES6+** - Tecnologias web modernas

### DevTools
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Qualidade de código
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

## 📦 Instalação

### Pré-requisitos
- **Node.js** >= 18.x
- **pnpm** >= 8.x (recomendado) ou npm/yarn

### Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/nest-websocket-api.git
cd nest-websocket-api
```

### Instalar Dependências
```bash
pnpm install
# ou
npm install
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente
Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

#### Variáveis Disponíveis
```bash
# 🚀 CONFIGURAÇÃO DO SERVIDOR
PORT=4000                    # Porta do servidor

# 🌐 CONFIGURAÇÃO CORS  
CORS_ORIGIN=*               # Origem permitida (* para desenvolvimento)

# 🔌 CONFIGURAÇÃO WEBSOCKET
WEBSOCKET_NAMESPACE=/ws/rooms # Namespace do Socket.IO

# 📱 CONFIGURAÇÕES DA APLICAÇÃO
APP_NAME="NestJS WebSocket Room API"
APP_VERSION=1.0.0
```

### 2. Scripts Disponíveis

#### Desenvolvimento
```bash
pnpm run start:dev          # Servidor em modo watch
pnpm run start:debug        # Servidor com debug habilitado
```

#### Produção
```bash
pnpm run build             # Compilar para produção
pnpm run start:prod        # Executar versão compilada
```

#### Qualidade de Código
```bash
pnpm run lint              # Executar ESLint
pnpm run format            # Formatar código com Prettier
```

## 🎯 Uso

### Iniciar o Servidor
```bash
pnpm run start:dev
```

O servidor estará disponível em:
- **API REST**: `http://localhost:4000`
- **WebSocket**: `ws://localhost:4000/ws/rooms`
- **Interface Admin**: `http://localhost:4000/admin` (protótipo)
- **Socket.IO Tester**: `http://localhost:4000/admin/socket-tester` (protótipo)

## 📚 Endpoints da API

### Salas (Rooms)

#### Criar Sala
```http
POST /room
Content-Type: application/json

{
  "name": "Minha Sala de Chat"
}
```

#### Listar Todas as Salas
```http
GET /room
```

#### Buscar Sala Específica
```http
GET /room/:id
```

#### Deletar Sala
```http
DELETE /room/:id
```

#### Obter Mensagens da Sala
```http
GET /room/:id/messages
```

#### Obter Participantes da Sala
```http
GET /room/:id/participants
```

### Monitoramento

#### Health Check
```http
GET /health
```

#### Métricas do Sistema
```http
GET /metrics
```

## 🔌 Eventos WebSocket

### Conexão
Conecte-se ao namespace `/ws/rooms`:

```javascript
const socket = io('http://localhost:4000/ws/rooms');
```

### Eventos do Cliente → Servidor

#### Entrar na Sala
```javascript
socket.emit('joinRoom', {
  roomId: 'room-id',
  participantName: 'Seu Nome' // opcional
});
```

#### Sair da Sala
```javascript
socket.emit('leaveRoom', {
  roomId: 'room-id'
});
```

#### Enviar Mensagem
```javascript
socket.emit('sendMessage', {
  roomId: 'room-id',
  message: 'Sua mensagem aqui'
});
```

#### Obter Informações da Sala
```javascript
socket.emit('getRoomInfo', {
  roomId: 'room-id'
});
```

#### Atualizar Nome do Participante
```javascript
socket.emit('updateParticipantName', {
  roomId: 'room-id',
  participantName: 'Novo Nome'
});
```

### Eventos do Servidor → Cliente

#### Entrou na Sala
```javascript
socket.on('joinedRoom', (data) => {
  console.log('Entrou na sala:', data);
  // { roomId, roomName, participants, recentMessages }
});
```

#### Usuário Entrou
```javascript
socket.on('userJoined', (data) => {
  console.log('Usuário entrou:', data);
  // { clientId, participantName, roomId, roomName, participantCount }
});
```

#### Usuário Saiu
```javascript
socket.on('userLeft', (data) => {
  console.log('Usuário saiu:', data);
  // { clientId, participantName, roomId, roomName, participantCount }
});
```

#### Nova Mensagem
```javascript
socket.on('newMessage', (data) => {
  console.log('Nova mensagem:', data);
  // { id, clientId, message, timestamp, roomId }
});
```

#### Informações da Sala
```javascript
socket.on('roomInfo', (data) => {
  console.log('Info da sala:', data);
  // { id, name, participantCount, participants, messageCount, createdAt }
});
```

#### Nome Atualizado
```javascript
socket.on('participantNameUpdated', (data) => {
  console.log('Nome atualizado:', data);
  // { clientId, participantName, roomId }
});
```

#### Erros
```javascript
socket.on('error', (error) => {
  console.error('Erro:', error);
  // { message: 'Descrição do erro' }
});
```

## 🎨 Interface Web Prototipada

> **⚠️ Aviso de Protótipo**: Todas as interfaces web são **protótipos/demos** para propósitos de desenvolvimento e teste.

### Dashboard Administrativo (`/admin`) - **PROTÓTIPO**
- **Visão geral** com métricas em tempo real
- **Gerenciamento de salas** (criar, listar, deletar)
- **Monitor de usuários** online
- **Chat integrado** para administração
- **Configurações** personalizáveis

### Socket.IO Tester (`/admin/socket-tester`) - **PROTÓTIPO**
Interface completa para testar todas as funcionalidades WebSocket:

- **Conexão WebSocket** com status visual
- **Gerenciamento de salas** via interface
- **Teste de eventos** em tempo real  
- **Log detalhado** de todas as ações
- **Interface responsiva** com Tailwind CSS

> **ℹ️ Uso**: Essas interfaces são projetadas para desenvolvedores testarem e entenderem a funcionalidade da API.

## 📁 Estrutura do Projeto

```
src/
├── 📁 common/              # Utilitários compartilhados
│   └── utils/
│       └── uptime.util.ts
├── 📁 events/              # Sistema de eventos
│   ├── events.module.ts
│   ├── events.service.ts
│   └── metrics.events.ts
├── 📁 health/              # Health checks
│   ├── health.controller.ts
│   ├── health.module.ts
│   └── health.service.ts
├── 📁 metrics/             # Métricas do sistema
│   ├── metrics.controller.ts
│   ├── metrics.module.ts
│   └── metrics.service.ts
├── 📁 room/                # Core - Salas de chat
│   ├── room.controller.ts  # REST endpoints
│   ├── room.gateway.ts     # WebSocket gateway
│   ├── room.module.ts      # Módulo das salas
│   └── room.service.ts     # Lógica de negócio
├── 📁 views/               # Interface web (protótipos)
│   ├── public/             # Arquivos estáticos
│   │   ├── *.html         # Páginas HTML
│   │   ├── scripts/       # JavaScript
│   │   └── styles/        # CSS
│   ├── views.controller.ts # Controlador de views
│   └── views.module.ts     # Módulo de views
├── app.controller.ts       # Controlador principal
├── app.module.ts          # Módulo raiz
├── app.service.ts         # Serviço principal
└── main.ts               # Entry point
```

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
pnpm run test

# Testes em modo watch
pnpm run test:watch

# Testes e2e
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

### Teste Manual com HTTP Client

Use o arquivo `requests/rooms.http` para testar os endpoints:

```http
### Criar uma sala
POST http://localhost:4000/room
Content-Type: application/json

{
  "name": "Sala de Teste"
}

### Listar todas as salas  
GET http://localhost:4000/room

### Buscar sala específica
GET http://localhost:4000/room/{{roomId}}
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 🚀 Deploy

### Variáveis de Produção
```bash
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://seu-dominio.com
WEBSOCKET_NAMESPACE=/ws/rooms
```

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Documentação**: Consulte este README
- **Issues**: Use o [GitHub Issues](https://github.com/seu-usuario/nest-websocket-api/issues)
- **Contato**: Abra uma discussão no repositório

---

<p align="center">
  Made with ❤️ using <a href="https://nestjs.com/">NestJS</a> and <a href="https://socket.io/">Socket.IO</a>
</p>