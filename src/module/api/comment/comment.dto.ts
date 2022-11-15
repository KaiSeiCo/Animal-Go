import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty()
  article_id: number;

  @ApiProperty()
  comment_content: string;
  
  @ApiProperty()
  reply_to: number;
}
