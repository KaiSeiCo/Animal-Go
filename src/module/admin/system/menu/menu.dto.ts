import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsString,
  MinLength,
  Min,
  ValidateIf,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单类型(0-父级菜单 1-子级菜单 2-按钮)' })
  @IsIn([0, 1, 2])
  type: number;

  @ApiProperty({ description: '父级菜单' })
  @IsInt()
  parent_id: number;

  @ApiProperty({ description: '菜单或权限名称' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '排序' })
  @IsInt()
  @Min(0)
  order_num: number;

  @ApiProperty({ description: '前端路由地址' })
  @IsString()
  @ValidateIf((o) => o.type !== 2)
  router: string;

  @ApiProperty({ description: '菜单是否显示', required: false, default: true })
  @IsBoolean()
  @ValidateIf((o) => o.type !== 2)
  readonly is_show: boolean = true;

  @ApiProperty({ description: '开启页面缓存', required: false, default: true })
  @IsBoolean()
  @ValidateIf((o) => o.type === 1)
  readonly keepalive: boolean = true;

  @ApiProperty({ description: '菜单图标', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type !== 2)
  icon: string;

  @ApiProperty({ description: '对应权限' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type === 2)
  perms: string;

  @ApiProperty({ description: '菜单路由路径或外链' })
  @ValidateIf((o) => o.type !== 2)
  @IsString()
  @IsOptional()
  view_path: string;
}

export class UpdateMenuDto {
  @ApiProperty({ description: '菜单id', required: true })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '菜单类型' })
  @IsOptional()
  @IsIn([0, 1, 2])
  type: number;

  @ApiProperty({ description: '父级菜单' })
  @IsOptional()
  @IsInt()
  parent_id: number;

  @ApiProperty({ description: '菜单或权限名称' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '排序' })
  @IsInt()
  @Min(0)
  order_num: number;

  @ApiProperty({ description: '前端路由地址' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.type !== 2)
  router: string;

  @ApiProperty({ description: '菜单是否显示', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  @ValidateIf((o) => o.type !== 2)
  readonly is_show: boolean = true;

  @ApiProperty({ description: '开启页面缓存', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  @ValidateIf((o) => o.type === 1)
  readonly keepalive: boolean = true;

  @ApiProperty({ description: '菜单图标', required: false })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type !== 2)
  icon: string;

  @ApiProperty({ description: '对应权限' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type === 2)
  perms: string;

  @ApiProperty({ description: '菜单路由路径或外链' })
  @ValidateIf((o) => o.type !== 2)
  @IsString()
  @IsOptional()
  view_path: string;
}
