import { Injectable } from '@nestjs/common';
import { LikePayload } from 'src/module/api/article/article.dto';
import { KafkaPayload, MessageType } from '../kafka.interface';
import { KafkaService } from '../kafka.service';
import { ARTICLE_PRODUCER_TOPIC } from '../topic.constants';

@Injectable()
export class ArticleProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  saveLike(body: LikePayload) {
    const payload: KafkaPayload<LikePayload> = {
      body,
      messageId: new Date().getTime().toString(),
      messageType: MessageType.COMMON,
      topicName: ARTICLE_PRODUCER_TOPIC,
    };
    this.kafkaService.sendMessage(ARTICLE_PRODUCER_TOPIC, payload);
  }
}
