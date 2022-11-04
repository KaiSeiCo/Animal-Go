import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Delete, Query } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import {
  CreateRoleDto,
  UpdateRoleDto,
} from 'src/module/admin/system/role/role.dto';
import { Role } from 'src/model/entity/sys/role.entity';
import { RoleService } from './role.service';

@ApiTags('角色模块')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 获取角色列表接口
   * @returns
   */
  @OpenApi()
  @ApiOperation({ summary: '获取所有角色' })
  @Get('list')
  async list(): Promise<Result<Role[]>> {
    const role = await this.roleService.list();
    return Result.success(role);
  }

  /**
   * 添加角色接口
   * @param dto
   * @returns
   */
  @ApiOperation({ summary: '添加角色' })
  @Post('add')
  async add(@Body() dto: CreateRoleDto): Promise<Result<void>> {
    await this.roleService.save(dto);
    return Result.success();
  }

  /**
   * 删除角色接口
   * @param id
   * @returns
   */
  @ApiOperation({ summary: '删除角色' })
  @Delete('delete')
  async delete(@Query('id') id: number): Promise<Result<void>> {
    await this.roleService.delete(id);
    return Result.success();
  }

  /**
   * 更新角色信息接口
   * @param dto
   * @returns
   */
  @ApiOperation({ summary: '更新角色权限资源' })
  @Put('update')
  async updateRole(@Body() dto: UpdateRoleDto): Promise<Result<void>> {
    await this.roleService.update(dto);
    return Result.success();
  }
}
