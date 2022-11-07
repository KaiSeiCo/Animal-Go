import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ArticleProducer } from 'src/global/kafka/producer/article-producer.service';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { ForumController } from './forum/forum.controller';
import { ForumService } from './forum/forum.service';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';

@Module({
  providers: [
    ArticleService,
    ForumService,
    TagService,
    ArticleProducer,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [ArticleController, ForumController, TagController],
})
export class ApiModule {}
