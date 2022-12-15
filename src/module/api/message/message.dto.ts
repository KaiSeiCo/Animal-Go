import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { PageOptionsDto } from 'src/model/dto/page.dto';

// export class MessagePageQueryDto extends PageOptionsDto {
  // @ApiProperty({
  //   description: '消息内容',
  //   required: false,
  // })
  // @IsOptional()
  // message_content: string;
// }

export class MessageSendDto {
  @ApiProperty({
    description: '消息内容',
    required: true,
  })
  @IsNotEmpty()
  message_content: string;

  @ApiProperty({
    description: '营地id',
    required: true
  })
  @IsNotEmpty()
  camp_id: string;

  @ApiProperty({
    description: '回复消息的id',
    required: false,
  })
  @IsOptional()
  reply_to: string
}

export class MessageHistoryDto {
  @ApiProperty({
    description: '当前页包含数量',
    required: false,
    default: 20,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number = 20;

  @ApiProperty({
    description: '',
    required: false,
  })
  readonly prev: string;
}

/* kafka payload */
export type MessagePayload = {
  event: string;
  data: any;
  room?: string;
}