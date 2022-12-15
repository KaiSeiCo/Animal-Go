import { Socket } from 'socket.io';

export interface ExSocket extends Socket {
  uid: string;
}