import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { isEmpty } from 'lodash';
import { Server } from 'socket.io';
import { CampRepository } from 'src/model/repository/app/camp.repository';
import { MessageRepository } from 'src/model/repository/app/message.repository';
import { SendMessageDto } from '../api/message/message.dto';

@WebSocketGateway()
export class MessageGateway {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly campRepository: CampRepository,
  ) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('buildCamp')
  async buildCamp() {}

  @SubscribeMessage('joinCamp')
  async joinCamp() {}

  @SubscribeMessage('leaveCamp')
  async leaveCamp() {}

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
      this.emitError('message', 'camp not exists');
      throw new Error('camp not exists');
    }

    // check reply message exist if data has reply_to
    if (reply_to && !replyMessage) {
      throw new Error('message not exists');
    }

    await this.messageRepository.insert({
      ...data,
    });

    this.emitSuccess('message', { message: data.message_content });
  }

  @SubscribeMessage('recallMessage')
  async recallMessage() {}

  private emitSuccess(eventName: string, data: any) {
    this.server.emit(eventName, {
      status: 'ok',
      message: 'ok',
      data,
    });
  }

  private emitError(eventName: string, error: string) {
    this.server.emit(eventName, {
      status: 'error',
      message: error,
    });
  }
}
