import { Injectable } from '@nestjs/common';
import { Mission } from 'src/common/decorator/mission.decorator';
import { RedisService } from 'src/global/redis/redis.service';

@Injectable()
@Mission()
export class TestJob {
  constructor(private readonly redisService: RedisService) {}

  async handle() {
    await this.redisService.getRedis().incr('test');
  }
}
