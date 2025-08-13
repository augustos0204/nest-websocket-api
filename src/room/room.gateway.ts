import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway({
  namespace: process.env.WEBSOCKET_NAMESPACE || '/room', // Namespace específico para salas
  cors: {
    origin: '*', // Configure adequadamente para produção
  },
})
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RoomGateway');

  constructor(private readonly roomService: RoomService) {}

  afterInit(server: Server) {
    this.logger.log('Room Gateway inicializado no namespace /room');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Cliente conectado no namespace room: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado do namespace room: ${client.id}`);
    
    // Remove o cliente de todas as salas ao desconectar
    const rooms = this.roomService.getAllRooms();
    rooms.forEach(room => {
      if (room.participants.includes(client.id)) {
        this.roomService.leaveRoom(room.id, client.id);
        client.to(room.id).emit('userLeft', {
          clientId: client.id,
          roomId: room.id,
          roomName: room.name,
        });
      }
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    const room = this.roomService.getRoom(roomId);
    
    if (!room) {
      client.emit('error', { message: 'Sala não encontrada' });
      return;
    }

    // Join no Socket.IO room
    client.join(roomId);
    
    // Adicionar ao serviço
    this.roomService.joinRoom(roomId, client.id);
    
    // Notificar outros usuários na sala
    client.to(roomId).emit('userJoined', {
      clientId: client.id,
      roomId: room.id,
      roomName: room.name,
      participantCount: room.participants.length,
    });

    // Confirmar entrada para o cliente
    client.emit('joinedRoom', {
      roomId: room.id,
      roomName: room.name,
      participants: room.participants,
      recentMessages: room.messages.slice(-10), // Últimas 10 mensagens
    });

    this.logger.log(`Cliente ${client.id} entrou na sala: ${roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    
    // Leave no Socket.IO room
    client.leave(roomId);
    
    // Remover do serviço
    const success = this.roomService.leaveRoom(roomId, client.id);
    
    if (success) {
      const room = this.roomService.getRoom(roomId);
      
      // Notificar outros usuários na sala
      client.to(roomId).emit('userLeft', {
        clientId: client.id,
        roomId: roomId,
        roomName: room?.name,
        participantCount: room?.participants.length || 0,
      });

      // Confirmar saída para o cliente
      client.emit('leftRoom', { roomId });
      
      this.logger.log(`Cliente ${client.id} saiu da sala: ${roomId}`);
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId, message } = data;
    
    // Adicionar mensagem ao serviço
    const roomMessage = this.roomService.addMessage(roomId, client.id, message);
    
    if (!roomMessage) {
      client.emit('error', { message: 'Não foi possível enviar a mensagem' });
      return;
    }

    // Enviar mensagem para todos os usuários na sala
    this.server.to(roomId).emit('newMessage', {
      id: roomMessage.id,
      clientId: roomMessage.clientId,
      message: roomMessage.message,
      timestamp: roomMessage.timestamp,
      roomId: roomId,
    });

    this.logger.log(`Mensagem enviada na sala ${roomId} por ${client.id}: ${message}`);
  }

  @SubscribeMessage('getRoomInfo')
  handleGetRoomInfo(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    const room = this.roomService.getRoom(roomId);
    
    if (!room) {
      client.emit('error', { message: 'Sala não encontrada' });
      return;
    }

    client.emit('roomInfo', {
      id: room.id,
      name: room.name,
      participantCount: room.participants.length,
      participants: room.participants,
      messageCount: room.messages.length,
      createdAt: room.createdAt,
    });
  }
}
