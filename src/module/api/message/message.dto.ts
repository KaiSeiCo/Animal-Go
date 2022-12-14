import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/model/dto/page.dto';

export class MessagePageQueryDto extends PageOptionsDto {
  @ApiProperty({
    description: '消息内容',
    required: false,
  })
  @IsOptional()
  message_content: string;
}
