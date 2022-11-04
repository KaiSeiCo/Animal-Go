import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import {
  CreateMenuDto,
  UpdateMenuDto,
} from 'src/module/admin/system/menu/menu.dto';
import { Menu } from 'src/model/entity/sys/menu.entity';
import { MenuService } from './menu.service';

@ApiTags('菜单模块')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 获取所有菜单接口
   * @returns Menu[]
   */
  @OpenApi()
  @ApiOperation({ summary: '获取所有菜单' })
  @Get('list')
  async list(): Promise<Result<Menu[]>> {
    const menus = await this.menuService.list();
    return Result.success(menus);
  }

  /**
   * 添加菜单接口
   * @param dto
   * @returns
   */
  @ApiOperation({ summary: '添加菜单' })
  @Post('add')
  async add(@Body() dto: CreateMenuDto): Promise<Result<void>> {
    await this.menuService.save(dto);
    return Result.success();
  }

  /**
   * 删除菜单接口
   * @param id
   * @returns
   */
  @ApiOperation({ summary: '删除菜单' })
  @Delete('delete')
  async delete(@Query('id') id: number): Promise<Result<void>> {
    await this.menuService.delete(id);
    return Result.success();
  }

  /**
   * 修改菜单信息接口
   * @param dto
   * @returns
   */
  @ApiOperation({ summary: '修改菜单' })
  @Put('update')
  async update(@Body() dto: UpdateMenuDto) {
    await this.menuService.update(dto);
    return Result.success();
  }
}
