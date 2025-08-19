export interface Room {
  id: string;
  name: string;
  participants: string[];
  participantNames: Map<string, string | null>;
  createdAt: Date;
  messages: RoomMessage[];
}

export interface RoomMessage {
  id: string;
  clientId: string;
  message: string;
  timestamp: Date;
}

export class CreateRoomDto {
  name: string;
}