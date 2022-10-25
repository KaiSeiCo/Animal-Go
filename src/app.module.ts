import './polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './module/admin/admin.module';
import Config from './config/env/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareModule } from './share/share.module';
import { LoggerModule } from './share/logger/logger.module';
import {
  LoggerModuleOptions,
  WinstonLogLevel,
} from './share/logger/logger.interface';
import { TypeORMLoggerService } from './share/logger/typeorm-logger.service';
import { LOGGER_MODULE_OPTIONS } from './common/constant/logger.constants';
import { RouterModule } from '@nestjs/core';
import {
  ADMIN_ROUTER_PREFIX,
  API_V1_ROUTER_PREFIX,
} from './common/constant/router-prefix.constants';
import { ApiModule } from './module/api/api.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    // router prefix register
    RouterModule.register([
      {
        path: ADMIN_ROUTER_PREFIX,
        children: [AdminModule],
      },
      {
        path: API_V1_ROUTER_PREFIX,
        children: [ApiModule],
      },
    ]),
    // Apply Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Config],
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
    }),
    // task queue
    BullModule.forRoot({}),
    // db
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService, LOGGER_MODULE_OPTIONS],
      useFactory: (
        config: ConfigService,
        loggerOptions: LoggerModuleOptions,
      ) => ({
        autoLoadEntities: true,
        type: config.get<any>('database.type'),
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        synchronize: config.get<boolean>('database.synchronize'),
        logging: config.get('database.logging'),
        // custom sql logger
        logger: new TypeORMLoggerService(
          config.get('database.logging'),
          loggerOptions,
        ),
      }),
    }),
    // custom logger
    LoggerModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => {
          return {
            level: config.get<WinstonLogLevel>('logger.level'),
            consoleLevel: config.get<WinstonLogLevel>('logger.consoleLevel'),
            timestamp: config.get<boolean>('logger.timestamp'),
            maxFiles: config.get<string>('logger.maxFiles'),
            maxFileSize: config.get<string>('logger.maxFileSize'),
            disableConsoleAtProd: config.get<boolean>(
              'logger.disableConsoleAtProd',
            ),
            dir: config.get<string>('logger.dir'),
            errorLogName: config.get<string>('logger.errorLogName'),
            appLogName: config.get<string>('logger.appLogName'),
          };
        },
        inject: [ConfigService],
      },
      true,
    ),
    // Module
    // custom
    ShareModule,
    // cms api
    AdminModule,
    // common api
    ApiModule,
    // websocket
  ],
})
export class AppModule {}
