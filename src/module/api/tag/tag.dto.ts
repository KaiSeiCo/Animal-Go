import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { PageOptionsDto } from 'src/model/dto/page.dto';

export class TagCreateDto {
  @ApiProperty({ description: '标签名' })
  @Length(2, 16, { message: '标签名长度在2到16之间' })
  tag_name: string;
}

export class TagPageQueryDto extends PageOptionsDto {
  @ApiProperty({
    description: '标签名',
  })
  @IsOptional()
  tag_name: string;
}
