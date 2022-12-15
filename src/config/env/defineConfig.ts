import { LoggerModuleOptions as LoggerConfigOptions } from 'src/global/logger/logger.interface';
import { LoggerOptions } from 'typeorm';

export function defineConfig(config: IConfig): IConfig {
  return config;
}

export interface IConfig {
  /**
   * jwt
   */
  jwt?: JwtConfigOptions;

  /**
   * 数据库配置
   */
  database?: DataBaseConfigOptions;

  /**
   * Redis 配置
   */
  redis?: RedisConfigOptions;

  /**
   * Redis 适配器
   */
  redisAdapterClient?: RedisConfigOptions;

  /**
   * 应用级别日志配置
   */
  logger?: LoggerConfigOptions;

  /**
   * Swagger api文档设置
   */
  swagger?: SwaggerConfigOptions;

  /**
   * kafka 配置
   */
  kafka?: KafkaConfigOptions;
}

export interface JwtConfigOptions {
  secret: string;
}

export interface RedisConfigOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

export interface DataBaseConfigOptions {
  type?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  database?: string;
  synchronize?: boolean;
  logging?: LoggerOptions;
}

export interface SwaggerConfigOptions {
  enable?: boolean;
  path?: string;
  title?: string;
  desc?: string;
  version?: string;
}

export interface KafkaConfigOptions {
  brokers?: string;
  groupId?: string;
}
