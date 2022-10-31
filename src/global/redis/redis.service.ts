import { Redis } from 'ioredis';
import { Cluster } from 'cluster';
import {
  REDIS_CLIENT,
  REDIS_DEFAULT_CLIENT_KEY,
} from 'src/common/constant/module.constants';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly clients: Map<string, Redis | Cluster>,
  ) {}

  public getRedis(name = REDIS_DEFAULT_CLIENT_KEY): Redis {
    if (!this.clients.has(name)) {
      throw new Error(`redis client ${name} does not exists`);
    }
    return this.clients.get(name) as Redis;
  }
}
