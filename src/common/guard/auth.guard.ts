import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';
import { getLoginRecordKey } from 'src/global/redis/redis.key';
import { RedisService } from 'src/global/redis/redis.service';
import { JwtUtil } from 'src/util/jwt.util';
import { HttpResponseKeyMap } from '../constant/http-res-map.constants';
import {
  ADMIN_ROUTER_PREFIX,
  API_V1_ROUTER_PREFIX,
} from '../constant/router-prefix.constants';
import {
  BEARER_TOKEN_PREFIX,
  ONLY_REQUIRE_LOGIN_KEY_METADATA,
  OPEN_API_KEY_METADATA,
} from '../constant/system.constant';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtUtil,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @OpenApi skip token validation
    const isOpenApi = this.reflector.get<boolean>(
      OPEN_API_KEY_METADATA,
      context.getHandler(),
    );
    if (isOpenApi) {
      return true;
    }

    // get request info
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const url = request.url;
    const path = url.split('?')[0];
    const token = request.headers['authorization'];

    if (isEmpty(token)) {
      throw new ApiException(HttpResponseKeyMap.NOT_LOGIN);
    }

    // check token valid
    const user = this.jwt.parseToken(token);
    const loginRecord = await this.redisService
      .getRedis()
      .get(getLoginRecordKey(user.id));
    if (!user || !loginRecord || token !== BEARER_TOKEN_PREFIX + loginRecord) {
      throw new ApiException(HttpResponseKeyMap.INVALID_TOKEN);
    }

    // @RequireLogin skip perms check
    const requireLogin = this.reflector.get<boolean>(
      ONLY_REQUIRE_LOGIN_KEY_METADATA,
      context.getHandler(),
    );
    if (requireLogin) {
      return true;
    }

    // check perms
    const { perms } = user;
    const permArray: string[] = perms.map((perm) => {
      return perm.replace(/:/g, '/');
    });
    if (
      !permArray.includes(
        path
          .replace(`/${ADMIN_ROUTER_PREFIX}/`, '')
          .replace(`/${API_V1_ROUTER_PREFIX}/`, ''),
      )
    ) {
      throw new ApiException(HttpResponseKeyMap.PERMS_NOT_ALLOWED);
    }

    return true;
  }
}
