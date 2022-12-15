import { Socket } from 'socket.io';

export interface ExSocket extends Socket {
  uid: string;
  room_id: string;
}