import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeDetail } from 'src/model/entity/app/like_detail.entity';
import { ArticleConsumer } from './article-consumer.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikeDetail])],
  providers: [ArticleConsumer],
})
export class ConsumerModule {}
