import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  SYSTEM_TASK_QUEUE_NAME,
  SYSTEM_TASK_QUEUE_PREFIX,
} from 'src/common/constant/system.constant';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { TaskController } from './task/task.controller';
import { TaskConsumer } from './task/task.processor';
import { TaskService } from './task/task.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: SYSTEM_TASK_QUEUE_NAME,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get<string>('redis.password'),
          db: config.get<number>('redis.db'),
        },
        prefix: SYSTEM_TASK_QUEUE_PREFIX,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TaskController, MenuController, RoleController],
  providers: [TaskService, TaskConsumer, MenuService, RoleService],
  exports: [],
})
export class SystemModule {}
