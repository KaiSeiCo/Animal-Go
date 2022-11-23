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

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  tag_ids: string[];
}

export class ArticleUpdateDto {
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty()
  id: string;

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

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  tag_ids: string[];
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

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  tag_ids: string[];

  @ApiProperty({ description: '用户id', required: false })
  @IsOptional()
  user_id: string;
}

/* kafka dto */
export interface LikePayload {
  user_id: string;
  article_id: string;
  deleted: boolean;
}

export interface FavorPayload {
  user_id: string;
  article_id: string;
  deleted: boolean;
}

/* sql result */
export type ArticleListSqlResult = {
  article_id?: string;
  article_title?: string;
  article_desc?: string;
  created_at?: Date;
  updated_at?: Date;
  pinned?: boolean;
  deleted?: boolean;
  status?: number;
  tag_id?: string;
  tag_name?: string;
  user_id?: string;
};
