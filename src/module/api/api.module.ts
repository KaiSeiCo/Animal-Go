import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ConsumerModule } from 'src/global/kafka/consumer/consumer.module';
import { ArticleProducer } from 'src/global/kafka/producer/article-producer.service';
import { Article } from 'src/model/entity/app/article.entity';
import { ArticleTag } from 'src/model/entity/app/article_tag.entity';
import { Forum } from 'src/model/entity/app/forum.entity';
import { LikeDetail } from 'src/model/entity/app/like_detail.entity';
import { Tag } from 'src/model/entity/app/tag.entity';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { ForumController } from './forum/forum.controller';
import { ForumService } from './forum/forum.service';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Tag, ArticleTag, Forum, LikeDetail]),
  ],
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
