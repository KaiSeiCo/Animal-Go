import { Injectable } from '@nestjs/common';
import { WsPayload } from 'src/module/api/message/message.dto';
import { KafkaPayload, MessageType } from '../kafka.interface';
import { KafkaService } from '../kafka.service';
import { ConsumerTopics, KafkaConsumeEvents } from '../topic.constants';

@Injectable()
export class MessageProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  sendWsEvent(body: WsPayload) {
    const payload: KafkaPayload<WsPayload> = {
      body: body,
      event: KafkaConsumeEvents.MESSAGE_SEND,
      messageId: new Date().getTime().toString(),
      messageType: MessageType.SOCKET,
      topicName: ConsumerTopics.MESSAGE_TOPIC,
    };
    return this.kafkaService.sendMessage<WsPayload>(
      ConsumerTopics.MESSAGE_TOPIC,
      payload,
    );
  }
}
