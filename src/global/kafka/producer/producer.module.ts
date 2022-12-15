import { Module } from '@nestjs/common';
import { ArticleProducer } from './article-producer.service';
import { MessageProducer } from './message-producer.service';

const producers = [ArticleProducer, MessageProducer];

@Module({
  providers: [...producers],
  exports: [...producers],
})
export class ProducerModule {}
