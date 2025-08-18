export interface MetricsEvents {
  'metrics:client-connected': ClientEventPayload;
  'metrics:client-disconnected': ClientEventPayload;
  'metrics:room-created': RoomEventPayload;
  'metrics:room-deleted': RoomEventPayload;
  'metrics:user-joined-room': UserRoomEventPayload;
  'metrics:user-left-room': UserRoomEventPayload;
  'metrics:message-sent': MessageEventPayload;
}

export interface ClientEventPayload {
  clientId: string;
  timestamp: Date;
  namespace?: string;
}

export interface RoomEventPayload {
  roomId: string;
  roomName: string;
  timestamp: Date;
}

export interface UserRoomEventPayload {
  clientId: string;
  roomId: string;
  roomName: string;
  participantName?: string | null;
  timestamp: Date;
}

export interface MessageEventPayload {
  messageId: string;
  clientId: string;
  roomId: string;
  roomName: string;
  timestamp: Date;
}

export type MetricsEventKeys = keyof MetricsEvents;
