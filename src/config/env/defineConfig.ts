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
   * 应用级别日志配置
   */
  logger?: LoggerConfigOptions;

  /**
   * Swagger api文档设置
   */
  swagger?: SwaggerConfigOptions;
}

export interface JwtConfigOptions {
  secret: string;
}

export interface RedisConfigOptions {
  host?: string;
  port?: number | string;
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
