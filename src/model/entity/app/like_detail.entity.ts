import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'tb_like_detail' })
@Index('article-user-index', ['article_id', 'user_id'])
@Index('photo-user-index', ['photo_id', 'user_id'])
export class LikeDetail extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  @ApiProperty()
  id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '文章id',
    nullable: true,
  })
  @ApiProperty()
  article_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '图片id',
    nullable: true,
  })
  @ApiProperty()
  photo_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '用户id',
  })
  @ApiProperty()
  user_id: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    comment: '是否点赞',
  })
  @ApiProperty()
  deleted: boolean;
}
