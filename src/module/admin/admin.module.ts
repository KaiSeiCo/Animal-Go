import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { OperationLog } from 'src/model/entity/sys/opt_log.entity';
import User from 'src/model/entity/sys/user.entity';
import { OperationLogService } from 'src/module/admin/system/log/opt_log.service';
import { UserService } from 'src/module/admin/user/user.service';
import { AuthController } from './user/auth.controller';
import { UserController } from './user/user.controller';
import { MenuService } from './system/menu/menu.service';
import { Menu } from 'src/model/entity/sys/menu.entity';
import { Role } from 'src/model/entity/sys/role.entity';
import { RoleController } from './system/role/role.controller';
import { RoleMenu } from 'src/model/entity/sys/role_menu.entity';
import { UserRole } from 'src/model/entity/sys/user_role.entity';
import { SystemModule } from './system/system.module';
import { MenuController } from './system/menu/menu.controller';
import { RoleService } from './system/role/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OperationLog,
      Menu,
      Role,
      RoleMenu,
      UserRole,
    ]),
    SystemModule,
  ],
  providers: [
    UserService,
    OperationLogService,
    MenuService,
    RoleService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController, UserController, MenuController, RoleController],
  exports: [OperationLogService, SystemModule],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('admin');
  }
}
