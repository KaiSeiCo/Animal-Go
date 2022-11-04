import { HttpModule } from '@nestjs/axios';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { LikeDetail } from 'src/model/entity/app/like_detail.entity';
import { ArticleService } from 'src/module/api/article/article.service';
import { JwtUtil } from 'src/util/jwt.util';
import { UserContext } from './context/user.context';
import { ConsumerModule } from './kafka/consumer/consumer.module';
import { KafkaModule } from './kafka/kafka.module';
import { ProducerModule } from './kafka/producer/producer.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

// global service providers
const providers = [RedisService, UserContext, JwtUtil];

/**
 * 全局 Module
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([LikeDetail]),
    // axios http
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    // jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
    // redis cache
    CacheModule.register(),
    // redis
    RedisModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
        password: config.get<string>('redis.password'),
        db: config.get<number>('redis.db'),
      }),
      inject: [ConfigService],
    }),
    // kafka
    KafkaModule.registerAsync({
      imports: [ConfigModule, ConsumerModule],
      useFactory: (config: ConfigService) => ({
        brokers: config.get<string[]>('kafka.brokers'),
        groupId: config.get<string>('kafka.groupId'),
        randomSuffix: '-' + Math.floor(Math.random() * 100000),
      }),
      inject: [ConfigService],
    }),
    ConsumerModule,
    ProducerModule,
    // ctx
    ClsModule.forRoot({
      middleware: { mount: true },
    }),
  ],
  providers: [...providers],
  exports: [
    HttpModule,
    CacheModule,
    ...providers,
    JwtModule,
    ClsModule,
    KafkaModule,
    ProducerModule,
    ConsumerModule,
  ],
})
export class GlobalModule {}
