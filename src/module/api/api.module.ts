import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Article } from 'src/model/entity/app/article.entity';
import { ArticleTag } from 'src/model/entity/app/article_tag.entity';
import { Forum } from 'src/model/entity/app/forum.entity';
import { Tag } from 'src/model/entity/app/tag.entity';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { ForumController } from './forum/forum.controller';
import { ForumService } from './forum/forum.service';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';
// import { TestConsumer } from './test/test.consumer';
import { TestController } from './test/test.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, ArticleTag, Forum])],
  providers: [
    ArticleService,
    ForumService,
    TagService,
    // TestConsumer,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [
    ArticleController,
    ForumController,
    TagController,
    TestController,
  ],
})
export class ApiModule {}
