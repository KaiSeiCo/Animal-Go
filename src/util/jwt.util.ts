import { Injectable } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { BEARER_TOKEN_PREFIX } from 'src/common/constant/system.constant';
import { UserToken } from 'src/model/vo/user.vo';

@Injectable()
export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  /**
   * sign token
   * @param userToken
   * @returns token
   */
  signToken(userToken: UserToken): string {
    return this.jwtService.sign({ ...userToken });
  }

  /**
   * parse token
   * @param token
   * @returns UserToken
   */
  parseToken(token: string): UserToken {
    let userToken;
    try {
      userToken = this.jwtService.verify<UserToken>(
        token.replace(BEARER_TOKEN_PREFIX, ''),
      );
    } catch (e) {
      throw new Error('token invalid');
    }
    return userToken;
  }
}
