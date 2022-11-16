import { Injectable } from '@nestjs/common';
import { FavorPayload, LikePayload } from 'src/module/api/article/article.dto';
import { KafkaPayload, MessageType } from '../kafka.interface';
import { KafkaService } from '../kafka.service';
import { ConsumerTopics, KafkaConsumeEvents } from '../topic.constants';

@Injectable()
export class ArticleProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  saveLike(body: LikePayload) {
    const payload: KafkaPayload<LikePayload> = {
      body: body,
      event: KafkaConsumeEvents.ARTICLE_LIKE,
      messageId: new Date().getTime().toString(),
      messageType: MessageType.COMMON,
      topicName: ConsumerTopics.ARTICLE_TOPIC,
    };
    return this.kafkaService.sendMessage<LikePayload>(
      ConsumerTopics.ARTICLE_TOPIC,
      payload,
    );
  }

  saveFavor(body: FavorPayload) {
    const payload: KafkaPayload<FavorPayload> = {
      body,
      event: KafkaConsumeEvents.ARTICLE_FAVOR,
      messageId: new Date().getTime().toString(),
      messageType: MessageType.COMMON,
      topicName: ConsumerTopics.ARTICLE_TOPIC,
    };
    return this.kafkaService.sendMessage<FavorPayload>(
      ConsumerTopics.ARTICLE_TOPIC,
      payload,
    );
  }
}
