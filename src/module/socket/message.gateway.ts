import { UseFilters, UseGuards } from '@nestjs/common/decorators';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets/interfaces';
import { isEmpty } from 'lodash';
import { Server, Socket } from 'socket.io';
import WsExceptionFilter from 'src/common/exception/ws.exception';
import JwtWsGuard from 'src/common/guard/ws.guard';
import { LoggerService } from 'src/global/logger/logger.service';
import { CampRepository } from 'src/model/repository/app/camp.repository';
import { CampUserRepository } from 'src/model/repository/app/camp_user.repository';
import { MessageRepository } from 'src/model/repository/app/message.repository';
import { UserRepository } from 'src/model/repository/sys/user.repository';
import { WssCode } from './gateway.constants';
import { ExSocket } from './socket.typings';

// @UseGuards(JwtWsGuard)
// @UseFilters(new WsExceptionFilter())
@WebSocketGateway(81, { transports: ['websocket'] })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly logger: LoggerService,
  ) {}

  async afterInit(server: Server) {
    this.logger.log('message gateway initialized', server);
  }

  async handleDisconnect(socket: ExSocket) {
    this.logger.log(`WebSocket client disconnected: ${socket.id}`);
  }

  async handleConnection(socket: ExSocket) {
    const uid = socket.handshake.query.uid as string;
    socket.uid = uid
    socket.join(uid)
    console.log(socket.rooms)
    this.logger.log(`WebSocket client connected: ${socket.uid}`);
  }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('tests')
  async tests(@MessageBody() message: string) {
    const messages = await this.messageRepository.find();
    console.log(messages);
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      // @ts-ignore
      console.log(socket.uid);
    }

    this.emit('tests', {
      code: WssCode.OK,
      message,
      data: {
        message,
      },
    });
  }

  emit(
    eventName: string,
    payload: {
      code: WssCode;
      message: string;
      data?: any;
    },
    room?: string,
  ) {
    if (room) {
      this.server.to(room).emit(eventName, payload);
    } else {
      this.server.emit(eventName, payload);
    }
  }
}
