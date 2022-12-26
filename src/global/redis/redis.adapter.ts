import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { LoggerService } from '../logger/logger.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private conf: ConfigService;
  private logger: LoggerService;

  constructor(
    app: INestApplication,
    conf: ConfigService,
    logger: LoggerService,
  ) {
    super(app);
    this.conf = conf;
    this.logger = logger;
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://${this.conf.get<string>(
        'REDIS_HOST',
      )}:${this.conf.get<number>('REDIS_PORT')}`,
      password: `${this.conf.get<string>('REDIS_PASSWORD')}`,
    });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) =>
      this.logger.error('[Redis Pub Client Error]', err),
    );
    subClient.on('error', (err) =>
      this.logger.error('[Redis Sub Client Error]', err),
    );

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
