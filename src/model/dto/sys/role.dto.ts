import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
  })
  @IsString()
  @MinLength(2)
  role_name: string;

  @ApiProperty({
    description: '角色唯一标识',
  })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  role_label: string;

  @ApiProperty({
    description: '角色备注',
    required: false,
  })
  @IsString()
  @IsOptional()
  remark: string;
}

export class UpdateRoleDto {

  @ApiProperty({
    description: '角色id',
    required: true,
  })
  @IsNotEmpty()
  id: number

  @ApiProperty({
    description: '角色名称',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  role_name: string;

  @ApiProperty({
    description: '角色唯一标识',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  role_label: string;

  @ApiProperty({
    description: '角色备注',
    required: false,
  })
  @IsString()
  @IsOptional()
  remark: string;

  @ApiProperty({
    description: ''
  })
  @IsOptional()
  menus: number[]
}
