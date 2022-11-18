import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { OperationLogService } from 'src/module/admin/system/log/opt_log.service';
import { SystemModule } from './system/system.module';
import { ServiceManagerModule } from './service-manager/service-manager.module';

@Module({
  imports: [SystemModule, ServiceManagerModule],
  providers: [
    OperationLogService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [],
  exports: [OperationLogService, SystemModule],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('admin');
  }
}
