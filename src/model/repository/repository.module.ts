import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../entity/app/article.entity';
import { ArticleTag } from '../entity/app/article_tag.entity';
import { Forum } from '../entity/app/forum.entity';
import { LikeDetail } from '../entity/app/like_detail.entity';
import { Tag } from '../entity/app/tag.entity';
import { Menu } from '../entity/sys/menu.entity';
import { OperationLog } from '../entity/sys/opt_log.entity';
import { Role } from '../entity/sys/role.entity';
import { RoleMenu } from '../entity/sys/role_menu.entity';
import Task from '../entity/sys/task.entity';
import User from '../entity/sys/user.entity';
import { UserRole } from '../entity/sys/user_role.entity';
import { ArticleRepository } from './app/article.repository';
import { ArticleTagRepository } from './app/article_tag.repository';
import { ForumRepository } from './app/forum.repository';
import { LikeDetailRepository } from './app/like_detail.repository';
import { TagRepository } from './app/tag.repository';
import { OperationLogRepository } from './sys/log.repository';
import { MenuRepository } from './sys/menu.repository';
import { RoleRepository } from './sys/role.repository';
import { RoleMenuRepository } from './sys/role_menu.repository';
import { TaskRepository } from './sys/task.repository';
import { UserRepository } from './sys/user.repository';
import { UserRoleRepository } from './sys/user_role.repository';

export const repositories = [
  ArticleRepository,
  ForumRepository,
  LikeDetailRepository,
  TagRepository,
  ArticleTagRepository,
  OperationLogRepository,
  MenuRepository,
  RoleMenuRepository,
  RoleRepository,
  TaskRepository,
  UserRoleRepository,
  UserRepository,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      Forum,
      LikeDetail,
      Tag,
      ArticleTag,
      OperationLog,
      Menu,
      RoleMenu,
      Role,
      Task,
      UserRole,
      User,
    ]),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
