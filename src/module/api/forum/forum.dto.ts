import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ForumType } from './forum.constants';

export class ForumCreateDto {
  @ApiProperty({ description: '板块名称' })
  @IsNotEmpty()
  forum_name: string;

  @ApiProperty({ description: '板块类型' })
  @IsNotEmpty()
  forum_type: ForumType;
}

export class ForumQueryDto {
  @ApiProperty({ description: '板块类型', required: false })
  @IsOptional()
  forum_type?: ForumType;
}
