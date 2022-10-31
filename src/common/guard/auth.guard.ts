import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { isEmpty } from 'lodash';
import { RedisService } from 'src/global/redis/redis.service';
import { HttpResponseKeyMap } from '../constant/http/http-res-map.constants';
import { OPEN_API_KEY_METADATA } from '../constant/system.constant';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector, 
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @OpenApi skip token validation
    const authorize = this.reflector.get<boolean>(
      OPEN_API_KEY_METADATA,
      context.getHandler(),
    );
    if (authorize) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const url = request.url;
    const path = url.split('?')[0];
    const token = request.headers['authorization'];

    if (isEmpty(token)) {
      throw new ApiException(HttpResponseKeyMap.NOT_LOGIN);
    }
    // [TODO-RECORD-221023]
    // may check menu path resource in decoded token
    const user = this.jwtService.verify(token.replace('Bearer ', ''));
    // [TODO-RECORD-221023]
    // check token in redis

    /**
     * if (decodeInfo.perms not contains path) {
     *    return false
     * }
     */
    return true;
  }
}
