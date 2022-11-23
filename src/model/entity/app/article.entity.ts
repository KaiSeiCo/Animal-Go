import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'tb_article' })
export class Article extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 128,
    comment: '标题',
  })
  article_title: string;

  @Column({
    type: 'varchar',
    length: 64,
    comment: '文章简述',
    nullable: true,
  })
  article_desc: string;

  @Column({
    type: 'longtext',
    comment: '内容',
  })
  article_content: string;

  @Column({
    type: 'varchar',
    length: 1024,
    comment: '封面',
    nullable: true,
  })
  article_cover: string;

  @Column({
    type: 'boolean',
    comment: '是否置顶',
    default: false,
  })
  pinned: boolean;

  @Column({
    type: 'boolean',
    comment: '是否删除',
    default: false,
  })
  deleted: boolean;

  @Column({
    type: 'tinyint',
    comment: '状态(0 公开,1 私密)',
    default: 0,
  })
  status: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '所属用户id',
  })
  user_id: string;
}
