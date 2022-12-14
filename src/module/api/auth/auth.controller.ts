import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { UserLoginDto, UserRegisterDto } from 'src/module/api/user/user.dto';
import { LoginVo } from 'src/model/vo/user.vo';
import { UserService } from '../user/user.service';

/**
 * @desc api used for authentication
 */
@ApiTags('认证模块')
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  /**
   * @desc login user
   * @returns userinfo
   */
  @ApiOperation({
    summary: '登录',
  })
  @OpenApi()
  @Post('login')
  async login(@Body() loginDto: UserLoginDto): Promise<Result<LoginVo>> {
    const token = await this.userService.login(loginDto);
    return Result.success(token);
  }

  /**
   * @desc register user
   * @returns true|false
   */
  @ApiOperation({
    summary: '注册',
  })
  @OpenApi()
  @Post('register')
  async register(@Body() waitToReg: UserRegisterDto): Promise<Result<boolean>> {
    await this.userService.register(waitToReg);
    return Result.success();
  }
}
