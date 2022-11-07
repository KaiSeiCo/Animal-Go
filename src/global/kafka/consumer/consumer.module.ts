import { Module } from '@nestjs/common';
import { ArticleConsumer } from './article-consumer.service';

@Module({
  providers: [ArticleConsumer],
})
export class ConsumerModule {}
