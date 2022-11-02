import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isNotEmpty } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { UserContext } from 'src/global/context/user.context';
import User from 'src/model/entity/sys/user.entity';
import { JwtUtil } from 'src/util/jwt.util';
import { OPEN_API_KEY_METADATA } from '../constant/system.constant';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly userContext: UserContext,
    private readonly jwtUtil: JwtUtil,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isOpenApi = this.reflector.get<boolean>(
      OPEN_API_KEY_METADATA,
      context.getHandler(),
    );

    if (!isOpenApi) {
      const request = context.switchToHttp().getRequest<FastifyRequest>();
      const token = request.headers['authorization'];
      if (isNotEmpty(token)) {
        const user = this.jwtUtil.parseToken(token);
        this.userContext.set('user', {
          user,
        });
      }
    }
    return next.handle();
  }
}
