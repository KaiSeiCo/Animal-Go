import { Module } from '@nestjs/common';
import { ArticleService } from 'src/module/api/article/article.service';
import { TagService } from 'src/module/api/tag/tag.service';
import { UserService } from 'src/module/api/user/user.service';
import { ArticleManagerController } from './controller/article-manager.controller';
import { TagManagerController } from './controller/tag-manager.controller';
import { UserManagerController } from './controller/user-manager.controller';

@Module({
  controllers: [
    ArticleManagerController,
    TagManagerController,
    UserManagerController,
  ],
  providers: [ArticleService, TagService, UserService],
  exports: [],
})
export class ServiceManagerModule {}
