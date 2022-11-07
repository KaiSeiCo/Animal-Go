import { Injectable } from '@nestjs/common';
import { Mission } from 'src/common/decorator/mission.decorator';
import { RedisService } from 'src/global/redis/redis.service';

@Mission()
@Injectable()
export class ArticleCronJob {
  constructor(private redisService: RedisService) {}

  async syncCountToRedis() {}
}
