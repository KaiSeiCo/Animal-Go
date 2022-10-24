import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PageResult, Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { UpdateUserDto, UserQueryDto } from 'src/model/dto/sys/user.dto';
import { UserListVo } from 'src/model/vo/user.vo';
import { UserService } from 'src/module/admin/user/user.service';

/**
 * @desc api used for authentication
 */
@ApiTags('用户模块')
@ApiBearerAuth()
@Controller('user')
export class UserController {
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
  @Get('list')
  async list(
    @Query() query: UserQueryDto,
  ): Promise<Result<PageResult<UserListVo>>> {
    const [list, total] = await this.userService.page(query);
    return Result.success({
      list,
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
  @Put('update')
  async update(@Body() dto: UpdateUserDto): Promise<Result<void>> {
    await this.userService.update(dto);
    return Result.success();
  }
}
