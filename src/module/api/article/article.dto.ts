import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/model/dto/page.dto';
import { ArticleStatus } from './article.constants';

/* common dto */
export class ArticlePublishDto {
  @ApiProperty({ description: '标题', required: true })
  @IsNotEmpty()
  article_title: string;

  @ApiProperty({ description: '内容', required: true })
  @IsNotEmpty()
  article_content: string;

  @ApiProperty({ description: '封面', required: true })
  @IsNotEmpty()
  article_cover: string;

  @ApiProperty({ description: '文章简述', required: false })
  @IsOptional()
  article_desc: string;

  @ApiProperty({ description: '置顶', required: false })
  @IsOptional()
  pinned: boolean = false;

  @ApiProperty({ description: '状态(0公开 1私密)', required: false })
  @IsOptional()
  status: number = ArticleStatus.PUBLIC;

  @ApiProperty({ description: '板块id', required: false })
  @IsOptional()
  forum_id: number;

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  tag_ids: number[];
}

export class ArticleUpdateDto {
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '标题', required: false })
  @IsOptional()
  article_title: string;

  @ApiProperty({ description: '内容', required: false })
  @IsOptional()
  article_content: string;

  @ApiProperty({ description: '封面', required: false })
  @IsOptional()
  article_cover: string;

  @ApiProperty({ description: '置顶', required: false })
  @IsOptional()
  pinned: boolean;

  @ApiProperty({ description: '状态(0公开 1私密)', required: false })
  @IsOptional()
  status: number;

  @ApiProperty({ description: '板块id', required: false })
  @IsOptional()
  forum_id: number;

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  tag_ids: number[];
}

export class ArticleQueryDto extends PageOptionsDto {
  @ApiProperty({ description: '标题', required: false })
  @IsOptional()
  article_title: string;

  @ApiProperty({ description: '删除', required: false })
  @IsOptional()
  deleted: boolean;

  @ApiProperty({ description: '状态(0公开 1私密)', required: false })
  @IsOptional()
  status: number;

  @ApiProperty({ description: '板块id', required: false })
  @IsOptional()
  forum_id: number;

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  tag_ids: number[];

  @ApiProperty({ description: '用户id', required: false })
  @IsOptional()
  user_id: number;
}

/* kafka dto */
export interface LikePayload {
  user_id: number;
  article_id: number;
  deleted: boolean;
}

export interface FavorPayload {
  user_id: number;
  article_id: number;
  deleted: boolean;
}

/* sql result */
export type ArticleListSqlResult = {
  article_id?: number;
  article_title?: string;
  article_desc?: string;
  publish_at?: Date;
  edit_at?: Date;
  pinned?: boolean;
  deleted?: boolean;
  status?: number;
  tag_id?: number;
  tag_name?: string;
  forum_id?: number;
  forum_name?: string;
  user_id?: number;
};
