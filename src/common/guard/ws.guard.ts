import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { getLoginRecordKey } from 'src/global/redis/redis.key';
import { RedisService } from 'src/global/redis/redis.service';
import { JwtUtil } from 'src/util/jwt.util';
import { HttpResponseKeyMap } from '../constant/http-res-map.constants';
import { BEARER_TOKEN_PREFIX } from '../constant/system.constant';
import { ApiException } from '../exception/api.exception';

export default class JwtWsGuard implements CanActivate {
  constructor(private jwt: JwtUtil, private redisService: RedisService) {}

  async canActivate(ctx: ExecutionContext) {
    const { token } = ctx.switchToWs().getData();
    console.log(token);
    if (!token) {
      throw new WsException(HttpResponseKeyMap.NOT_LOGIN);
    }

    // check token valid
    const user = this.jwt.parseToken(token);
    const loginRecord = await this.redisService
      .getRedis()
      .get(getLoginRecordKey(user.id));
    if (!user || !loginRecord || token !== BEARER_TOKEN_PREFIX + loginRecord) {
      throw new ApiException(HttpResponseKeyMap.INVALID_TOKEN);
    }

    return true;
  }
}
