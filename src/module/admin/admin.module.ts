import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { OperationLogService } from 'src/module/admin/system/log/opt_log.service';
import { UserService } from 'src/module/admin/user/user.service';
import { UserController } from './user/user.controller';
import { MenuService } from './system/menu/menu.service';
import { RoleController } from './system/role/role.controller';
import { SystemModule } from './system/system.module';
import { MenuController } from './system/menu/menu.controller';
import { RoleService } from './system/role/role.service';
import { ServiceAdminController } from './service-manager/service-manager.controller';
import { ArticleService } from '../api/article/article.service';
import { TagService } from '../api/tag/tag.service';
import { ForumService } from '../api/forum/forum.service';

@Module({
  imports: [SystemModule],
  providers: [
    UserService,
    OperationLogService,
    MenuService,
    RoleService,
    ArticleService,
    TagService,
    ForumService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [
    UserController,
    MenuController,
    RoleController,
    ServiceAdminController,
  ],
  exports: [OperationLogService, SystemModule],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('admin');
  }
}
