import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ArticleProducer } from 'src/global/kafka/producer/article-producer.service';
import { AuthController } from './auth/auth.controller';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { UserService } from './user/user.service';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { CampController } from './camp/camp.controller';
import { CampService } from './camp/camp.service';

const services = [
  UserService,
  ArticleService,
  TagService,
  CommentService,
  ArticleProducer,
  MessageService,
  CampService,
];
const controllers = [
  AuthController,
  CommentController,
  ArticleController,
  TagController,
  MessageController,
  CampController,
];

@Module({
  providers: [
    ...services,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [...controllers],
})
export class ApiModule {}
