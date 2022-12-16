import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from 'src/global/logger/logger.service';
import { WsPayload } from 'src/module/api/message/message.dto';
import { WssCode } from 'src/module/socket/gateway.constants';
import { MessageGateway } from 'src/module/socket/message.gateway';
import { Subscribe } from '../kafka.decorator';
import { ConsumerTopics, KafkaConsumeEvents } from '../topic.constants';

@Injectable()
export class MessageConsumer {
  constructor(
    private logger: LoggerService,
    private messageGateway: MessageGateway,
  ) {}

  @Subscribe(ConsumerTopics.MESSAGE_TOPIC)
  @OnEvent(KafkaConsumeEvents.MESSAGE_SEND)
  async sendMessage(payload: WsPayload) {
    this.logger.log('[🚥 Message-Consumer-Event] start send message websocket event');
    const { event, data } = payload
    this.messageGateway.emit(
      event,
      {
        code: WssCode.OK,
        message: 'OK',
        data: data
      }
    )
  }
}
