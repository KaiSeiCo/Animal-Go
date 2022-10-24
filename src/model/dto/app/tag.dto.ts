import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class TagCreateDto {
  @ApiProperty({ description: '标签名' })
  @Length(2, 16, { message: '标签名长度在2到16之间' })
  tag_name: string;
}
