import { Module } from '@nestjs/common';
import { ArticleProducer } from './article-producer.service';

@Module({
  providers: [ArticleProducer],
  exports: [ArticleProducer],
})
export class ProducerModule {}
