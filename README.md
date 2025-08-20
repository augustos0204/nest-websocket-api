# 🔌 RoomStream - API

A robust and scalable WebSocket API built with **NestJS** and **Socket.IO** for creating and managing real-time chat rooms.
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

## 🚀 Technologies

### Backend
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[Socket.IO](https://socket.io/)** - Real-time WebSocket library
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript
- **[@nestjs/event-emitter](https://docs.nestjs.com/techniques/events)** - Event system
- **[@nestjs/config](https://docs.nestjs.com/techniques/configuration)** - Configuration management

### Frontend - (Prototypes and debug cases)
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
PORT=3000                    # Server port

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
- **REST API**: `http://localhost:3000`
- **WebSocket**: `ws://localhost:3000/ws/rooms`
- **Web Interface for Debug/Tests**: `http://localhost:3000/admin`

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
const socket = io('http://localhost:3000/ws/rooms');
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

### Websocket Client Tester (`/admin/admin`) - **PROTOTYPE**
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

Use the `hostname/admin` page to test endpoints:

```http
### Create a room
POST http://localhost:3000/room
Content-Type: application/json

{
  "name": "Test Room"
}

### List all rooms
GET http://localhost:3000/room

### Get specific room
GET http://localhost:3000/room/{{roomId}}
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

## 📞 Support

- **Documentation**: Check this README
- **Issues**: Use [GitHub Issues](https://github.com/augustos0204/nest-websocket-api/issues)
- **Contact**: Start a discussion in the repository

---

<p align="center">
  Made with ❤️ using <a href="https://nestjs.com/">NestJS</a> and <a href="https://socket.io/">Socket.IO</a>
</p>
