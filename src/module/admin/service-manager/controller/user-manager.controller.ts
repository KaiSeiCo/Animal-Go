import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PageResult, Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { UpdateUserDto, UserQueryDto } from 'src/module/api/user/user.dto';
import { UserInfoVo } from 'src/model/vo/user.vo';
import { UserService } from 'src/module/api/user/user.service';

@ApiTags('服务管理')
@ApiBearerAuth()
@Controller('/users')
export class UserManagerController {
  constructor(private userService: UserService) {}

  /**
   * 获取用户列表接口
   * @param query
   * @returns
   */
  @ApiOperation({
    summary: '分页获取用户列表',
  })
  @OpenApi()
  @Get('')
  async list(
    @Query() query: UserQueryDto,
  ): Promise<Result<PageResult<UserInfoVo>>> {
    const [data, total] = await this.userService.page(query);
    return Result.success({
      data,
      pagination: {
        total,
        page: query.page,
        size: query.limit,
      },
    });
  }

  @ApiOperation({
    summary: '管理员更新用户信息',
  })
  @Put('')
  async update(@Body() dto: UpdateUserDto): Promise<Result<void>> {
    await this.userService.update(dto);
    return Result.success();
  }
}
