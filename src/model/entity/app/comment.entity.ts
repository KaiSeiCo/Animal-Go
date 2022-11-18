import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('tb_comment')
export class Comment extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '评论文章id',
  })
  article_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '评论用户id',
  })
  user_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '父级id',
    nullable: true,
  })
  parent_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '回复评论id',
    nullable: true,
  })
  reply_to: number;

  @Column({
    type: 'varchar',
    length: '1024',
    comment: '回复内容',
  })
  comment_content: string;

  @Column({
    type: 'tinyint',
    unsigned: true,
    comment: '是否删除',
    default: false,
  })
  deleted: boolean;

  @Column({
    type: 'tinyint',
    unsigned: true,
    comment: '是否审核',
    default: true,
  })
  reviewed: boolean;
}
