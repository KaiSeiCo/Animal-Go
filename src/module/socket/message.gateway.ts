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
import {
  BuildCampDto,
  JoinCampDto,
  LeaveCampDto,
  SendMessageDto,
} from './gateway.dto';
import { ExSocket } from './socket.typings';

// @UseGuards(JwtWsGuard)
// @UseFilters(new WsExceptionFilter())
@WebSocketGateway(81, { transports: ['websocket'] })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly campRepository: CampRepository,
    private readonly userRepository: UserRepository,
    private readonly campUserRepository: CampUserRepository,
    private readonly logger: LoggerService,
  ) {}

  async afterInit(server: Server) {
    this.logger.log('message gateway initialized', server);
  }

  async handleDisconnect(client: ExSocket) {
    this.logger.log(`WebSocket client disconnected: ${client.id}`);
  }

  async handleConnection(client: ExSocket, ...args: any[]) {
    client.uid = client.handshake.query.uid as string;
    this.logger.log(`WebSocket client connected: ${client.uid}`);
  }

  @WebSocketServer()
  private server: Server;

  /**
   * build camp
   * @param client
   * @param data
   * @returns
   */
  @SubscribeMessage('buildCamp')
  async buildCamp(
    @ConnectedSocket() client: ExSocket,
    @MessageBody() data: BuildCampDto,
  ) {
    const { camp_name, camp_desc, user_id } = data;

    // user not exists
    const user = await this.userRepository.findOneBy({
      id: user_id,
    });
    if (!user) {
      this.emit('buildCamp', {
        code: WssCode.FAILED,
        message: 'user not exists',
      });
      return;
    }

    // camp name already exists
    const camp = await this.campRepository.findOneBy({
      camp_name,
    });
    if (camp) {
      this.emit('buildCamp', {
        code: WssCode.FAILED,
        message: 'duplicate camp name',
      });
      return;
    }

    // build camp
    const result = await this.campRepository.save({
      camp_name,
      camp_desc,
      owner: user_id,
    });

    await this.campUserRepository.save({
      user_id,
      camp_id: camp.id,
    });

    const { id: camp_id } = result;
    // join camp
    client.join(camp_id);

    this.emit(
      'buildCamp',
      {
        code: WssCode.OK,
        message: 'build camp success',
        data: result,
      },
      camp_id,
    );
  }

  @SubscribeMessage('joinCamp')
  async joinCamp(
    @ConnectedSocket() client: ExSocket,
    @MessageBody() data: JoinCampDto,
  ) {
    const { camp_id, user_id } = data;
    const [camp, user, joined] = await Promise.all([
      this.campRepository.findOneBy({
        id: camp_id,
      }),
      this.userRepository.findOneBy({
        id: user_id,
      }),
      this.campUserRepository.findOneBy({
        camp_id,
        user_id,
      }),
    ]);

    if (!camp) {
      this.emit('joinCamp', {
        code: WssCode.FAILED,
        message: 'camp not exists',
        data: null,
      });
      return;
    }

    if (!user) {
      this.emit('joinCamp', {
        code: WssCode.FAILED,
        message: 'user not exists',
        data: null,
      });
      return;
    }

    if (joined && !joined.deleted) {
      this.emit('joinCamp', {
        code: WssCode.OK,
        message: `${user.nickname} already joined camp ${camp.camp_name}`,
      });
      return;
    }

    await this.campUserRepository.save({
      id: joined ? joined.id : undefined,
      camp_id,
      user_id,
      deleted: false,
    });

    client.join(camp_id);
    this.emit(
      'joinCamp',
      {
        code: WssCode.OK,
        message: `${user.nickname} join the camp`,
      },
      camp_id,
    );
  }

  @SubscribeMessage('leaveCamp')
  async leaveCamp(
    @ConnectedSocket() client: ExSocket,
    @MessageBody() data: LeaveCampDto,
  ) {
    const { user_id, camp_id } = data;

    const [camp, user, joined] = await Promise.all([
      this.campRepository.findOneBy({
        id: camp_id,
      }),
      this.userRepository.findOneBy({
        id: user_id,
      }),
      this.campUserRepository.findOneBy({
        camp_id,
        user_id,
      }),
    ]);

    if (!joined) {
      this.emit('leaveCamp', {
        code: WssCode.FAILED,
        message: `user not join the camp`,
      });
      return;
    }

    client.leave(camp_id);
    this.emit(
      'leaveCamp',
      {
        code: WssCode.OK,
        message: `${user.nickname} leave the camp ${camp.camp_name}`,
      },
      camp_id,
    );
  }

  /**
   * send message to camp
   * @param data
   * @returns
   */
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: SendMessageDto) {
    const { camp_id, reply_to } = data;

    const [camp, replyMessage] = await Promise.all([
      this.campRepository.findOneBy({
        id: camp_id,
        deleted: false,
      }),
      isEmpty(reply_to)
        ? null
        : this.messageRepository.findOneBy({
            id: reply_to,
            deleted: false,
          }),
    ]);

    // check camp exist
    if (!camp) {
      this.emit('messages', {
        code: WssCode.FAILED,
        message: 'camp not exists',
      });
      return;
    }

    // check reply message exist if data has reply_to
    if (reply_to && !replyMessage) {
      this.emit('messages', {
        code: WssCode.FAILED,
        message: 'message not exists',
      });
      return;
    }

    const message = await this.messageRepository.save({
      ...data,
    });

    this.emit(
      'messages',
      {
        code: WssCode.OK,
        message: 'ok',
        data: {
          message: message.message_content,
        },
      },
      camp_id,
    );
  }

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
