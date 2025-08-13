import { Injectable, Logger } from '@nestjs/common';

export interface Room {
  id: string;
  name: string;
  participants: string[];
  createdAt: Date;
  messages: RoomMessage[];
}

export interface RoomMessage {
  id: string;
  clientId: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);
  private rooms: Map<string, Room> = new Map();

  createRoom(name: string): Room {
    const roomId = this.generateRoomId();
    const room: Room = {
      id: roomId,
      name,
      participants: [],
      createdAt: new Date(),
      messages: [],
    };

    this.rooms.set(roomId, room);
    this.logger.log(`Sala criada: ${roomId} (${name})`);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  joinRoom(roomId: string, clientId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) {
      this.logger.warn(`Tentativa de entrar em sala inexistente: ${roomId}`);
      return false;
    }

    if (!room.participants.includes(clientId)) {
      room.participants.push(clientId);
      this.logger.log(`Cliente ${clientId} entrou na sala ${roomId}`);
    }

    return true;
  }

  leaveRoom(roomId: string, clientId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) {
      return false;
    }

    const index = room.participants.indexOf(clientId);
    if (index > -1) {
      room.participants.splice(index, 1);
      this.logger.log(`Cliente ${clientId} saiu da sala ${roomId}`);
    }

    return true;
  }

  addMessage(roomId: string, clientId: string, message: string): RoomMessage | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      this.logger.warn(`Tentativa de enviar mensagem para sala inexistente: ${roomId}`);
      return null;
    }

    const roomMessage: RoomMessage = {
      id: this.generateMessageId(),
      clientId,
      message,
      timestamp: new Date(),
    };

    room.messages.push(roomMessage);
    this.logger.log(`Mensagem adicionada à sala ${roomId}: ${message}`);
    
    return roomMessage;
  }

  deleteRoom(roomId: string): boolean {
    const deleted = this.rooms.delete(roomId);
    if (deleted) {
      this.logger.log(`Sala deletada: ${roomId}`);
    }
    return deleted;
  }

  private generateRoomId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
