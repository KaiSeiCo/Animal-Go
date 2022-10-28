import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SYSTEM_TASK_QUEUE_NAME,
  SYSTEM_TASK_QUEUE_PREFIX,
} from 'src/common/constant/system.constant';
import Task from 'src/model/entity/sys/task.entity';
import { TaskController } from './task/task.controller';
import { TaskConsumer } from './task/task.processor';
import { TaskService } from './task/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
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
  controllers: [TaskController],
  providers: [TaskService, TaskConsumer],
  exports: [],
})
export class SystemModule {}
