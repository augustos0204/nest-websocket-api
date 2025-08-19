import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from './room.service';
import type { Room } from '../types/room.types';
import { CreateRoomDto } from '../types/room.types';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto): Room {
    if (!createRoomDto.name || createRoomDto.name.trim().length === 0) {
      throw new HttpException(
        'Nome da sala é obrigatório',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.roomService.createRoom(createRoomDto.name.trim());
  }

  @Get()
  getAllRooms(): Room[] {
    return this.roomService.getAllRooms();
  }

  @Get(':id')
  getRoom(@Param('id') id: string): Room {
    const room = this.roomService.getRoom(id);

    if (!room) {
      throw new HttpException('Sala não encontrada', HttpStatus.NOT_FOUND);
    }

    return room;
  }

  @Delete(':id')
  deleteRoom(@Param('id') id: string): { message: string } {
    const deleted = this.roomService.deleteRoom(id);

    if (!deleted) {
      throw new HttpException('Sala não encontrada', HttpStatus.NOT_FOUND);
    }

    return { message: 'Sala deletada com sucesso' };
  }

  @Get(':id/messages')
  getRoomMessages(@Param('id') id: string) {
    const room = this.roomService.getRoom(id);

    if (!room) {
      throw new HttpException('Sala não encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      roomId: room.id,
      roomName: room.name,
      messages: room.messages,
      totalMessages: room.messages.length,
    };
  }

  @Get(':id/participants')
  getRoomParticipants(@Param('id') id: string) {
    const room = this.roomService.getRoom(id);

    if (!room) {
      throw new HttpException('Sala não encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      roomId: room.id,
      roomName: room.name,
      participants: this.roomService.getParticipantsWithNames(id),
      participantCount: room.participants.length,
    };
  }
}
