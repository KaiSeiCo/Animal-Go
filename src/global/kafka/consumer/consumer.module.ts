import { Module } from '@nestjs/common';
import { ArticleConsumer } from './article-consumer.service';
import { MessageConsumer } from './message-consumer.service';

const consumers = [ArticleConsumer, MessageConsumer];

@Module({
  providers: [...consumers],
})
export class ConsumerModule {}
