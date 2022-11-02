import { Injectable } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
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
        token.replace('Bearer ', ''),
      );
    } catch (e) {
      throw new Error('token invalid');
    }
    return userToken;
  }
}
