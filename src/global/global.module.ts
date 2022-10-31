import { HttpModule } from '@nestjs/axios';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConsumerModule } from './kafka/consumer/consumer.module';
import { KafkaModule } from './kafka/kafka.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

// global service providers
const providers = [RedisService];

/**
 * 全局 Module
 */
@Global()
@Module({
  imports: [
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
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        brokers: config.get<string[]>('kafka.brokers'),
        groupId: config.get<string>('kafka.groupId'),
      }),
      inject: [ConfigService],
    }),
    ConsumerModule,
  ],
  providers: [...providers],
  exports: [HttpModule, CacheModule, ...providers, JwtModule, KafkaModule],
})
export class GlobalModule {}
