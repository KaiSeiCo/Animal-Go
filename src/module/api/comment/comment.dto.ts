import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  @IsNotEmpty()
  article_id: string;

  @ApiProperty()
  @IsNotEmpty()
  comment_content: string;

  @ApiProperty()
  @IsOptional()
  reply_to: string;
}
